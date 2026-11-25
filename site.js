'use strict';
(() => {
  const content = window.ACUMELO;
  // English for a first visit; only a user's explicit language choice overrides it.
  let lang = 'en';
  try { const stored = localStorage.getItem('acumelo.language'); if (stored === 'ko' || stored === 'en') lang = stored; } catch {}
  const $ = s => document.querySelector(s);
  const media = matchMedia('(max-width: 900px)');
  const menuButton = $('#menu-toggle');
  const panel = $('#menu-panel');
  const form = $('#enquiry-form');
  let menuOpen = false;
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const t = key => content.copy[lang][key];
  function toggleMenu(open, restoreFocus = false) {
    menuOpen = Boolean(open && media.matches);
    panel.classList.toggle('is-open', menuOpen);
    menuButton.setAttribute('aria-expanded', String(menuOpen));
    menuButton.querySelector('[data-i18n]').textContent = t(menuOpen ? 'menuClose' : 'menu');
    document.body.classList.toggle('menu-open', menuOpen);
    $('#main').inert = menuOpen;
    if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => toggleMenu(!menuOpen));
  media.addEventListener('change', () => toggleMenu(false));
  document.addEventListener('keydown', e => {
    if (!menuOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); toggleMenu(false, true); }
    if (e.key === 'Tab') {
      const focusable = [...document.querySelectorAll('.sidebar a, .sidebar button')].filter(n => n.getClientRects().length);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  const courseIds = content.copy.ko.courses.map(course => course.id);
  const instructorIds = content.members.map(member => member.id);
  const instructorAliases = Object.fromEntries(content.members.flatMap(member => (member.legacyIds || []).map(id => [id, member.id])));
  const resolvePage = page => instructorAliases[page] || page;
  const teachingCourses = member => t('courses').filter(course => member.teachingFieldIds.includes(course.id));
  function assignedInstructorDemos(member) {
    const history = (content.mediaAssignments || []).filter(a => a.assignedInstructorId === member.id && a.placement === 'profile-demo');
    // Ownership does not identify the presenter. Missing/invalid assignments stay empty.
    return history.filter(a => a.status === 'active').map(assignment => {
      const asset = content.mediaCatalog?.[assignment.mediaId];
      if (!asset || asset.scope !== 'instructor' || asset.kind !== 'demo' || asset.assignedInstructorId !== member.id ||
          asset.fieldId !== assignment.fieldId || !member.teachingFieldIds.includes(assignment.fieldId) ||
          !member.media?.voiceId || asset.voiceId !== member.media.voiceId) return null;
      return {...asset, id:asset.mediaId, fieldIds:[assignment.fieldId]};
    }).filter(Boolean);
  }
  let selectedTeachingField = '';
  const pages = ['home', 'lectures', 'people', 'about', 'contact', 'library', ...courseIds, ...instructorIds];
  const library = el('section', 'section media-library');
  library.id = 'library'; library.hidden = true;
  $('#lectures').after(library);
  function pauseVideos(except) {
    document.querySelectorAll('video').forEach(video => { if (video !== except) video.pause(); });
  }
  document.addEventListener('play', event => {
    if (event.target instanceof HTMLVideoElement) pauseVideos(event.target);
  }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseVideos(); });
  [...courseIds, ...instructorIds].forEach(id => {
    const section = el('section', 'section ' + (instructorIds.includes(id) ? 'instructor-page' : 'course-page'));
    section.id = id; section.hidden = true;
    $('#lectures').after(section);
  });
  let activePage = 'home';
  function pageFromLocation() {
    const requested = resolvePage(new URL(location.href).searchParams.get('page'));
    const legacyHash = resolvePage(location.hash.slice(1));
    return pages.includes(requested) ? requested : pages.includes(legacyHash) ? legacyHash : 'home';
  }
  function pageUrl(page) {
    const url = new URL(location.href);
    url.hash = '';
    url.searchParams.set('page', page);
    url.searchParams.delete('field'); url.searchParams.delete('tab');
    return url.pathname + url.search;
  }
  function updatePageTitle() {
    const keys = { lectures: 'navLectures', people: 'navPeople', about: 'navAbout', contact: 'navContact', library: 'mediaLibraryTitle' };
    const course = t('courses').find(c => c.id === activePage);
    const member = content.members.find(m => m.id === activePage);
    const memberTitle = member && (member.name[lang] || t('memberPending'));
    document.title = activePage === 'home' ? t('title') : (course ? course.title : memberTitle || t(keys[activePage])) + ' — Acumelo';
  }
  function updatePageLinks() {
    document.querySelectorAll('[data-page-link]').forEach(link => {
      if (link.dataset.pageLink === activePage) link.setAttribute('aria-current', 'page');
      else if (link.closest('.main-nav') && link.dataset.pageLink === 'lectures' && (courseIds.includes(activePage) || activePage === 'library')) link.setAttribute('aria-current', 'location');
      else if (link.closest('.main-nav') && link.dataset.pageLink === 'people' && instructorIds.includes(activePage)) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function showPage(page, focus = false, resetScroll = true) {
    pauseVideos();
    activePage = pages.includes(page) ? page : 'home';
    toggleMenu(false);
    renderActivePage();
    if (activePage === 'contact') {
      const requested = new URL(location.href).searchParams;
      const field = requested.get('field');
      const member = content.members.find(m => m.id === requested.get('instructor'));
      if (courseIds.includes(field) && (!member || member.teachingFieldIds.includes(field))) $('#topic').value = field;
      document.getElementById('enquiry-context')?.remove();
      if (member && member.teachingFieldIds.includes(field)) {
        const note = el('p', 'learning-note', member.name[lang] + ' · ' + t('courses').find(c => c.id === field).title);
        note.id = 'enquiry-context'; form.prepend(note);
      }
      if (!$('#enquiry-result').hidden) $('#enquiry-draft').value = buildDraft();
    }
    document.body.dataset.page = activePage;
    document.querySelectorAll('main > section').forEach(section => {
      section.hidden = section.id !== activePage && !(activePage === 'about' && section.classList.contains('expertise'));
    });
    $('.footer').hidden = false;
    updatePageLinks();
    document.querySelectorAll('main > section h2[aria-level]').forEach(heading => heading.removeAttribute('aria-level'));
    const section = document.getElementById(activePage);
    const heading = section.querySelector('h1, h2');
    if (heading) heading.setAttribute('aria-level', '1');
    updatePageTitle();
    if (resetScroll) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (focus && heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const page = link.hash.slice(1);
    if (!pages.includes(page)) return;
    link.dataset.pageLink = page;
    link.href = '?page=' + page;
  });
  document.addEventListener('click', event => {
      const link = event.target.closest('a[data-page-link]');
      if (!link) return;
      const page = link.dataset.pageLink;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (link.dataset.course) {
        $('#topic').value = link.dataset.course;
        if (!$('#enquiry-result').hidden) $('#enquiry-draft').value = buildDraft();
        $('#form-status').textContent = '';
      }
      const samePage = activePage === page;
      const target = new URL(link.href, location.href);
      if (target.href !== location.href) {
        try { history.pushState({ page }, '', target.pathname + target.search); }
        catch { location.href = link.href; return; }
      }
      showPage(page, true, !samePage);
  });
  window.addEventListener('popstate', () => {
    const page = pageFromLocation();
    showPage(page, false, page !== activePage);
  });
  function pageLink(page, text, className = '') {
    const link = el('a', className, text);
    link.href = '?page=' + page;
    link.dataset.pageLink = page;
    return link;
  }
  function renderCourses() {
    const list = $('#course-list');
    list.replaceChildren();
    const labels = el('div', 'course-comparison-labels'); labels.setAttribute('aria-hidden', 'true');
    const copy = content.copy[lang].learning;
    labels.append(el('span', '', copy.field), el('span', '', copy.audience), el('span', '', copy.outcome)); list.append(labels);
    t('courses').forEach((c, i) => {
      const article = el('article', 'course');
      article.dataset.courseId = c.id;
      const link = contextLink(c.id, c.id, 'curriculum', undefined, 'course-link comparison-link');
      const number = el('span', 'course-number', String(i + 1).padStart(2, '0'));
      number.setAttribute('aria-hidden', 'true');
      const title = el('div', 'course-title');
      title.append(el('span', 'small-caps', c.tag), el('h2', '', c.title), el('span', 'course-view', t('courseView')));
      const arrow = el('span', 'course-arrow', '→'); arrow.setAttribute('aria-hidden', 'true');
      const audience = el('div', 'comparison-cell');
      const output = el('div', 'comparison-cell');
      audience.append(el('span', 'comparison-mobile-label', copy.audience), el('p', '', c.comparison.audience));
      output.append(el('span', 'comparison-mobile-label', copy.outcome), el('p', '', c.comparison.output));
      title.prepend(fieldIcon(c.id), number); title.append(arrow);
      link.append(title, audience, output);
      article.append(link); list.append(article);
    });
    updatePageLinks();
  }
  function contextLink(page, field, tab, label, className = '') {
    const link = pageLink(page, label, className);
    link.href += '&field=' + encodeURIComponent(field) + '&tab=' + tab;
    return link;
  }
  function fieldIcon(field) {
    const icon = el('img', 'field-icon');
    icon.src = 'assets/studio/field-' + field + '.svg'; icon.alt = '';
    icon.width = 48; icon.height = 48; icon.setAttribute('aria-hidden', 'true');
    return icon;
  }
  function renderActivePage() {
    // Unmounted contexts contain no hidden media, captions or stale playback.
    pauseVideos();
    [...courseIds, ...instructorIds, 'library'].forEach(id => document.getElementById(id).replaceChildren());
    const member = content.members.find(m => m.id === activePage);
    const course = t('courses').find(c => c.id === activePage);
    if (member) renderInstructorPage(member, content.members.indexOf(member));
    else if (course) renderCoursePage(course);
    else if (activePage === 'library') renderMediaLibrary();
  }
  function renderCoursePage(course) {
    const section = document.getElementById(course.id);
    const breadcrumb = el('div', 'section-heading');
    breadcrumb.append(pageLink('lectures', t('courseBack'), 'course-back'), el('span', 'small-caps', course.tag));
    const header = el('header', 'course-header learning-header');
    const heading = el('h1', 'page-title', course.title);
    heading.id = course.id + '-title'; section.setAttribute('aria-labelledby', heading.id);
    header.append(heading, el('p', 'course-lead', course.subtitle));
    const summary = el('dl', 'learning-field-summary');
    summary.append(el('dt', '', content.copy[lang].learning.audience), el('dd', '', course.comparison.audience), el('dt', '', content.copy[lang].learning.outcome), el('dd', '', course.comparison.output));
    header.append(summary);
    section.append(breadcrumb, header, learningWorkspace(null, course.id));
  }
  function curriculumModules(modules) {
    const list = el('div', 'learning-modules');
    modules.forEach((step, index) => {
      const item = el('details', 'learning-module');
      item.append(el('summary', '', String(index + 1).padStart(2, '0') + ' · ' + step[0]));
      const body = el('div'); body.append(el('p', '', step[1]), el('p', 'module-practice', t('coursePractice') + ' ' + step[2]));
      item.append(body); list.append(item);
    });
    return list;
  }
  function learningWorkspace(member, defaultField) {
    const copy = content.copy[lang].learning;
    const courses = member ? teachingCourses(member) : t('courses');
    const requested = new URL(location.href).searchParams;
    const isLibrary = activePage === 'library';
    const initialField = member || isLibrary ? courses.find(c => c.id === requested.get('field'))?.id || courses[0]?.id : defaultField;
    const tabs = ['curriculum', 'lecture', 'demo', 'project'];
    const state = {field: initialField, tab: tabs.includes(requested.get('tab')) ? requested.get('tab') : 'curriculum'};
    const workspace = el('section', 'learning-workspace');
    const prefix = member?.id || (isLibrary ? 'library' : defaultField);
    workspace.dataset.instructorId = member?.id || '';
    const heading = el('h2', 'learning-title', member ? copy.instructorTitle : copy.fieldTitle);
    heading.id = prefix + '-learning-title'; workspace.setAttribute('aria-labelledby', heading.id);
    const help = el('p', 'learning-help', copy.help);
    const fieldLabel = el('label', 'learning-field-label', copy.field);
    const select = el('select', 'learning-field-select'); select.id = prefix + '-field'; fieldLabel.htmlFor = select.id;
    const fieldButtons = el('div', 'learning-fields'); fieldButtons.setAttribute('role', 'group'); fieldButtons.setAttribute('aria-label', copy.field);
    const fieldControls = courses.map(course => {
      const option = el('option', '', course.title); option.value = course.id; select.append(option);
      const button = el('button', 'learning-field-button', course.title); button.type = 'button'; button.dataset.fieldId = course.id;
      button.prepend(fieldIcon(course.id));
      button.addEventListener('click', () => changeField(course.id)); fieldButtons.append(button);
      return button;
    });
    select.addEventListener('change', () => changeField(select.value));
    const tablist = el('div', 'learning-tabs'); tablist.setAttribute('role', 'tablist'); tablist.setAttribute('aria-label', copy.contents);
    const tabButtons = tabs.map(id => {
      const button = el('button', 'learning-tab', copy[id]); button.type = 'button'; button.dataset.tab = id;
      button.id = prefix + '-tab-' + id; button.setAttribute('role', 'tab'); button.setAttribute('aria-controls', prefix + '-panel');
      button.addEventListener('click', () => {state.tab = id; writeRoute(); update();});
      button.addEventListener('keydown', event => {
        let next;
        const index = tabs.indexOf(id);
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) {event.preventDefault(); tabButtons[next].focus({preventScroll:true}); tabButtons[next].click();}
      });
      tablist.append(button); return button;
    });
    const panel = el('div', 'learning-panel'); panel.setAttribute('role', 'tabpanel'); panel.tabIndex = 0;
    const notice = el('p', 'sr-only'); notice.setAttribute('role', 'status'); notice.setAttribute('aria-live', 'polite');
    workspace.append(heading, help, fieldLabel, select, fieldButtons, tablist, notice, panel);
    function writeRoute(replace = false) {
      const url = new URL(location.href);
      url.hash = ''; url.searchParams.set('page', member?.id || (isLibrary ? 'library' : state.field));
      url.searchParams.set('field', state.field); url.searchParams.set('tab', state.tab);
      if (url.href !== location.href) history[replace ? 'replaceState' : 'pushState']({page:member?.id || state.field, ...state}, '', url.pathname + url.search);
    }
    function changeField(field) {
      if (!courses.some(c => c.id === field) || state.field === field) return;
      state.field = field; writeRoute();
      if (!member && !isLibrary) {
        const y = window.scrollY;
        showPage(field, false, false);
        const target = media.matches ? document.querySelector('#' + field + ' .learning-field-select') : document.querySelector('#' + field + ' .learning-field-button[aria-pressed=true]');
        target?.focus({preventScroll:true}); window.scrollTo({top:y,behavior:'instant'});
      } else update();
    }
    function update() {
      pauseVideos();
      select.value = state.field;
      fieldControls.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.fieldId === state.field)));
      tabButtons.forEach(button => {const chosen = button.dataset.tab === state.tab; button.setAttribute('aria-selected', String(chosen)); button.tabIndex = chosen ? 0 : -1;});
      workspace.dataset.fieldId = state.field; workspace.dataset.tab = state.tab;
      panel.id = prefix + '-panel'; panel.setAttribute('aria-labelledby', prefix + '-tab-' + state.tab);
      panel.replaceChildren();
      const course = courses.find(c => c.id === state.field);
      if (!course) {panel.append(el('p', 'learning-pending', t('teachingFieldsPending'))); return;}
      notice.textContent = course.title + ' · ' + copy[state.tab];
      panel.append(el('h3', 'learning-panel-title', course.title + ' · ' + copy[state.tab]));
      if (state.tab === 'curriculum') {
        if (member) {
          const program = content.instructorPrograms?.find(p => p.instructorId === member.id && p.fieldId === course.id);
          panel.dataset.curriculumId = program?.curriculumId || '';
          if (program?.status === 'published' && program.modules?.[lang]?.length) {
            panel.append(curriculumModules(program.modules[lang]));
          } else panel.append(el('p', 'learning-pending', copy.curriculumPending.replace('{name}', member.name[lang])));
        } else {
          panel.dataset.curriculumId = 'field-' + course.id;
          panel.append(el('p', 'learning-note', t('curriculumNote')), curriculumModules(course.curriculum));
          const details = el('details', 'learning-course-details'); details.append(el('summary', '', copy.courseDetails));
          const goals = el('ul'); course.learning.forEach(goal => goals.append(el('li', '', goal)));
          details.append(el('p', '', course.body), el('h4', '', t('courseLearning')), goals, el('h4', '', t('courseAudience')), el('p', '', course.audience), el('h4', '', t('coursePrerequisites')), el('p', '', course.prerequisites), el('h4', '', t('outputLabel')), el('p', '', course.output), el('h4', '', t('courseFormat')), el('p', '', t('courseFormatBody')));
          if (course.id === 'development') details.append(el('h4', '', t('courseExtension')), el('p', '', t('courseExtensionBody')));
          panel.append(details);
          const links = el('nav', 'learning-instructors'); links.setAttribute('aria-label', copy.instructorCurricula);
          links.append(el('h4', '', copy.instructorCurricula));
          content.members.filter(m => m.teachingFieldIds.includes(course.id)).forEach(m => links.append(contextLink(m.id, course.id, 'curriculum', m.name[lang] + ' →', 'line-link')));
          panel.append(links);
        }
        const enquiry = pageLink('contact', t('courseEnquiry') + ' →', 'line-link');
        enquiry.href += '&field=' + course.id + (member ? '&instructor=' + member.id : '');
        enquiry.dataset.course = course.id; panel.append(enquiry);
      } else if (state.tab === 'lecture') {
        // A profile-wide film is not assumed to belong to every teaching field.
        const asset = member ? member.media?.lectures?.[course.id] : courseMediaAsset(course, 'lecture');
        const valid = !member || (asset?.fieldId === course.id && asset?.instructorId === member.id);
        if (valid && (asset?.src || asset?.url)) panel.append(mediaCard(asset, asset.title?.[lang] || copy.lecture));
        else panel.append(el('p', 'learning-pending', copy.lecturePending));
      } else {
        const assets = state.tab === 'demo' && member ? assignedInstructorDemos(member).filter(d => d.fieldId === course.id) : [courseMediaAsset(course, state.tab)].filter(d => d.src || d.url);
        panel.append(el('p', 'learning-note', state.tab === 'project' ? t('profileFieldProjectsNote') : member ? t('profileOwnDemoNote') : t('mediaExampleNotice')));
        appendScopedMedia(panel, assets, state.tab === 'project', prefix + '-' + state.field + '-' + state.tab);
      }
      if (state.tab !== 'curriculum') delete panel.dataset.curriculumId;
    }
    writeRoute(true); update(); return workspace;
  }
  function appendScopedMedia(panel, assets, project, id) {
    const copy = content.copy[lang].learning;
    if (!assets.length) {panel.append(el('p', 'learning-pending', t('mediaPending'))); return;}
    const search = el('details', 'learning-search'); search.append(el('summary', '', copy.search));
    const label = el('label', 'demo-search-label', t('profileDemoSearch')); label.htmlFor = id + '-search';
    const row = el('div', 'demo-search-row'), box = el('div', 'demo-search-box');
    const icon = el('span', 'demo-search-icon'); icon.setAttribute('aria-hidden', 'true');
    const input = el('input', 'demo-search'); input.type = 'search'; input.id = label.htmlFor; input.placeholder = t('profileDemoSearchPlaceholder'); input.maxLength = 160;
    const clear = el('button', 'demo-clear', t('profileDemoClear')); clear.type = 'button';
    const count = el('p', 'learning-result-count'); count.setAttribute('role', 'status');
    box.append(icon, input); row.append(box, clear); search.append(label, row, count);
    const results = el('div', 'learning-media'); results.id = id + '-results'; input.setAttribute('aria-controls', results.id);
    const strings = v => typeof v === 'string' ? v : v && typeof v === 'object' ? Object.values(v).map(strings).join(' ') : '';
    const normalize = v => v.normalize('NFKC').toLocaleLowerCase().trim();
    function update() {
      pauseVideos();
      const terms = normalize(input.value).split(/\s+/).filter(Boolean);
      const visible = assets.filter(a => terms.every(term => normalize(strings([a.title, a.description, a.tools, a.searchKeywords])).includes(term)));
      clear.disabled = !input.value;
      count.textContent = t('profileDemoCount').replace('{count}', visible.length).replace('{total}', assets.length);
      results.replaceChildren(...visible.map(asset => mediaCard(asset, asset.title?.[lang] || t(project ? 'mediaProject' : 'mediaDemo'), project)));
      if (!visible.length) results.append(el('p', 'learning-pending', t('profileDemoNoResults')));
    }
    input.addEventListener('input', update);
    clear.addEventListener('click', () => {input.value = ''; update(); input.focus({preventScroll:true});});
    panel.append(search, results); update();
  }
  function renderSequences() {
    const steps = $('#vibe-steps'), process = $('#process-list');
    steps.replaceChildren(); process.replaceChildren();
    t('vibeSteps').forEach((step, i) => {
      const item = el('div', 'vibe-step'), text = el('div');
      text.append(el('h4', '', step[0]), el('p', '', step[1]));
      item.append(el('span', '', String(i+1).padStart(2,'0')), text); steps.append(item);
    });
    t('process').forEach((step, i) => {
      const item = el('li', 'process-item');
      const number = el('span', '', String(i+1).padStart(2,'0')); number.setAttribute('aria-hidden','true');
      item.append(number, el('h4', '', step[0]), el('p', '', step[1])); process.append(item);
    });
  }
  const avatar = '<svg viewBox="0 0 240 270" fill="none" aria-hidden="true"><circle cx="120" cy="103" r="43" fill="currentColor" opacity=".36"/><path d="M36 255v-29a84 84 0 0 1 168 0v29" fill="currentColor" opacity=".36"/><circle cx="120" cy="103" r="43" stroke="currentColor" stroke-width="1"/><path d="M36 255v-29a84 84 0 0 1 168 0v29" stroke="currentColor" stroke-width="1"/><path d="M120 28v226M22 155h196" stroke="currentColor" stroke-width=".5" stroke-dasharray="3 5"/></svg>';
  // Empty media renders a non-interactive placeholder, never a broken player.
  // src: local file/direct video URL; url: an external watch/project page.
  let mediaDescriptionId = 0;
  function mediaCard(asset = {}, label, project = false, headingTag = 'h3') {
    const card = el('article', 'media-card');
    if (asset.id) card.dataset.mediaId = asset.id;
    for (const key of ['scope','kind','contentOwnerId','assignedInstructorId','voiceId','voiceRole']) {
      if (asset[key]) card.dataset[key] = asset[key];
    }
    const visual = el('div', 'media-visual');
    const hasLink = /^https?:\/\//i.test(asset.url || '');
    let player;
    if (asset.src) {
      const video = el('video'); video.src = asset.src;
      video.controls = true; video.playsInline = true; video.preload = 'none';
      video.setAttribute('aria-label', label);
      video.tabIndex = 0;
      if (asset.poster) video.poster = asset.poster;
      for (const caption of asset.captions || []) {
        const track = el('track'); track.kind = 'captions'; track.src = caption.src;
        track.srclang = caption.srclang; track.label = caption.label;
        track.default = caption.srclang === lang; video.append(track);
      }
      video.append(document.createTextNode(t('mediaVideoFallback')));
      video.addEventListener('error', () => {
        if (!card.querySelector('.media-error')) card.append(el('p', 'media-error', t('mediaLoadError')));
      });
      player = video;
      visual.append(video);
    } else if (asset.image || asset.poster) {
      const image = el('img'); image.src = asset.image || asset.poster;
      image.alt = label; image.loading = 'lazy'; visual.append(image);
    } else {
      visual.classList.add('media-empty');
      visual.append(el('span', 'media-grid-mark', '↗'), el('span', '', t(hasLink ? (project ? 'projectOpen' : 'mediaOpen') : 'mediaPending')));
      visual.firstChild.setAttribute('aria-hidden', 'true');
    }
    card.append(visual, el(headingTag, '', label));
    const descriptions = [];
    if (asset.illustrative) {
      card.append(el('p', 'media-example-label', t(project ? 'mediaProjectExample' : 'mediaDemoExample')));
    }
    if (asset.narration?.temporaryVoice) {
      const member = content.members.find(m => m.id === asset.assignedInstructorId);
      const note = asset.scope === 'category' ? t(project ? 'mediaSharedProjectAudio' : 'mediaSharedOverviewAudio') :
        member ? t('mediaInstructorAudio').replace('{name}', member.name[lang]) : t('mediaSyntheticAudio');
      card.append(el('p', 'media-audio-note', note));
    } else if (project && asset.hasBgm) {
      card.append(el('p', 'media-audio-note', t('mediaProjectBgmOnly')));
    }
    if (asset.description?.[lang]) descriptions.push(asset.description[lang]);
    if (descriptions.length) {
      const description = el('p', 'media-description', descriptions.join(' '));
      description.id = 'media-description-' + (++mediaDescriptionId);
      if (player) player.setAttribute('aria-describedby', description.id);
      card.append(description);
    }
    if (hasLink) {
      const link = el('a', 'line-link', t(project ? 'projectOpen' : 'mediaOpen') + ' ↗');
      link.href = asset.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; card.append(link);
    }
    return card;
  }
  function courseMediaAsset(course, kind) {
    const history = (content.mediaAssignments || []).filter(a => a.fieldId === course.id && a.placement === 'course-' + kind);
    if (history.length) {
      const active = history.find(a => a.status === 'active');
      const asset = active && content.mediaCatalog?.[active.mediaId];
      return asset?.fieldId === course.id && asset.scope === 'category' && asset.kind === kind && !asset.assignedInstructorId ? {...asset,id:asset.mediaId} : {};
    }
    const asset = content.courseMedia[course.id]?.[kind];
    if (kind === 'lecture') return asset || {};
    return asset?.scope === 'category' && asset.kind === kind && asset.fieldId === course.id && !asset.assignedInstructorId ? asset : {};
  }
  function renderMediaLibrary() {
    library.replaceChildren();
    const heading = el('h1', 'page-title', t('mediaLibraryTitle'));
    heading.id = 'media-library-title'; library.setAttribute('aria-labelledby', heading.id);
    library.append(pageLink('lectures', t('courseBack'), 'course-back'), heading, el('p', 'media-library-intro', t('mediaLibraryIntro')));
    if (content.mediaGallery) {
      const galleryLink = el('a', 'line-link media-library-entry', t('mediaGallery'));
      galleryLink.href = content.mediaGallery;
      library.append(galleryLink);
    }
    library.append(learningWorkspace(null, courseIds[0]));
  }
  function memberVisual(member) {
    const visual = el('div', 'member-visual');
    if (member.visualTone) visual.dataset.tone = member.visualTone;
    if (member.image) {
      const image = el('img', member.imagePresentation === 'cutout' ? 'avatar-cutout' : '');
      if (member.imageMirrored === true) image.classList.add('avatar-mirrored');
      image.src = member.image; image.alt = member.name[lang] || t('memberPending'); image.loading = 'lazy'; visual.append(image);
    } else {
      visual.innerHTML = avatar; visual.setAttribute('role', 'img'); visual.setAttribute('aria-label', t('memberAvatar'));
    }
    return visual;
  }
  function fieldTags(fieldIds, linked = false) {
    const tags = el('div', 'field-tags');
    t('courses').filter(course => fieldIds.includes(course.id)).forEach(course => {
      tags.append(linked ? pageLink(course.id, course.title, 'field-tag') : el('span', 'field-tag', course.title));
    });
    return tags;
  }
  function renderPeopleList() {
    const list = $('#people-list'); list.replaceChildren();
    const visible = content.members.filter(member => !selectedTeachingField || member.teachingFieldIds.includes(selectedTeachingField));
    visible.forEach(member => {
      const i = content.members.indexOf(member);
      const article = el('article', 'member'); article.dataset.memberId = member.id;
      // Keep each avatar's presentation attached to its identity while filtering.
      article.dataset.avatarIndex = i + 1;
      const link = selectedTeachingField ? contextLink(member.id, selectedTeachingField, 'curriculum', undefined, 'member-link') : pageLink(member.id, undefined, 'member-link');
      const visual = memberVisual(member);
      visual.append(el('span', 'member-index', String(i + 1).padStart(2, '0')));
      const details = el('div', 'member-details');
      details.append(el('h2', 'member-name', member.name[lang] || t('memberPending')));
      if (member.teachingFieldIds.length) {
        details.append(el('p', 'small-caps member-fields-label', t('profileSpecialty')), fieldTags(member.teachingFieldIds));
      } else details.append(el('p', 'member-fields-pending', t('teachingFieldsPending')));
      details.append(el('span', 'member-caption', t('profileView') + ' →'));
      link.append(visual, details); article.append(link); list.append(article);
    });
    const selectedLabel = selectedTeachingField ? t('courses').find(c => c.id === selectedTeachingField).title : t('filterAll');
    $('#people-count').textContent = selectedLabel + ' · ' + t(visible.length === 1 ? 'filterCountOne' : 'filterCount').replace('{count}', visible.length);
    $('#people-empty').textContent = t('filterEmpty');
    $('#people-empty').hidden = visible.length !== 0;
    $('#people-filters').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.fieldId === selectedTeachingField)));
    updatePageLinks();
  }
  function renderPeople() {
    const filters = $('#people-filters'); filters.replaceChildren();
    filters.setAttribute('aria-label', t('filterLabel'));
    [{ id: '', title: t('filterAll') }, ...t('courses')].forEach(course => {
      const button = el('button', 'field-filter', course.title);
      button.type = 'button'; button.dataset.fieldId = course.id;
      button.setAttribute('aria-controls', 'people-list');
      button.addEventListener('click', () => { selectedTeachingField = course.id; renderPeopleList(); });
      filters.append(button);
    });
    renderPeopleList();
    $('#intro-media').replaceChildren(mediaCard(content.assets.intro, t('mediaIntro')));
  }
  function renderInstructorPage(member, i) {
    const courses = teachingCourses(member);
    const section = document.getElementById(member.id); section.replaceChildren();
    const breadcrumb = el('div', 'section-heading');
    breadcrumb.append(pageLink('people', t('profileBack'), 'course-back'), el('span', 'small-caps', t('profileLabel') + ' / ' + String(i + 1).padStart(2, '0')));
    const hero = el('header', 'profile-hero');
    const text = el('div', 'profile-intro');
    const heading = el('h1', 'page-title', member.name[lang] || t('memberPending'));
    heading.id = member.id + '-title'; section.setAttribute('aria-labelledby', heading.id);
    text.append(el('p', 'small-caps', t('profileLabel')), heading);
    if (member.role[lang]) text.append(el('p', 'profile-field', member.role[lang]));
    hero.append(memberVisual(member), text);
    section.append(breadcrumb, hero, learningWorkspace(member));
    // Preserve original profile data without two empty, full-height sections.
    const biography = el('details', 'learning-biography');
    biography.append(el('summary', '', t('profileAbout') + ' / ' + t('profileCareer')));
    biography.append(el('h3', '', t('profileAbout')), el('p', '', member.bio[lang] || t('profileAboutPending')),
      el('h3', '', t('profileCareer')), el('p', '', member.career[lang] || t('profileCareerPending')));
    section.append(biography);
    const retained = (content.mediaAssignments || []).filter(a => a.status === 'active' && a.placement === 'owner-library' && a.assignedInstructorId === member.id)
      .map(a => content.mediaCatalog?.[a.mediaId]).filter(a => a?.contentOwnerId === member.id);
    if (retained.length) {
      const archive = el('details', 'learning-biography');
      archive.append(el('summary', '', t('profileOwnedLibrary')));
      for (const asset of retained) {
        const link = el('a', 'line-link', asset.title?.[lang] || t('mediaDemo'));
        link.href = asset.src || asset.url; archive.append(link);
      }
      section.append(archive);
    }
  }
  function buildDraft() {
    const org = $('#organization').value.trim() || t('notProvided');
    const selected = t('courses').find(c => c.id === $('#topic').value);
    const topic = selected ? selected.title + ' / ' + selected.subtitle : t('topicAny');
    const member = content.members.find(m => m.id === new URL(location.href).searchParams.get('instructor') && m.teachingFieldIds.includes(selected?.id));
    return [t('subject'), '', t('formOrganization') + ': ' + org, t('formTopic') + ': ' + topic,
      ...(member ? [t('profileLabel') + ': ' + member.name[lang]] : []), '', t('draftBodyLabel'), $('#enquiry').value.trim()].join('\n');
  }
  function setLanguage(next, save = true) {
    pauseVideos();
    lang = next;
    document.documentElement.lang = lang;
    updatePageTitle();
    $('meta[name="description"]').content = t('heroDescription');
    document.querySelectorAll('[data-i18n]').forEach(node => {
      const value = t(node.dataset.i18n);
      if (typeof value === 'string') node.textContent = value;
    });
    document.querySelectorAll('[data-placeholder]').forEach(node => node.placeholder = t(node.dataset.placeholder));
    document.querySelectorAll('[data-label]').forEach(node => node.setAttribute('aria-label', t(node.dataset.label)));
    document.querySelectorAll('[data-lang]').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.lang === lang)));
    $('.main-nav').setAttribute('aria-label', t('navigation'));
    $('.languages').setAttribute('aria-label', t('language'));
    menuButton.querySelector('[data-i18n]').textContent = t(menuOpen ? 'menuClose' : 'menu');
    mediaDescriptionId = 0;
    renderCourses(); renderSequences(); renderPeople(); renderActivePage();
    const selected = $('#topic').value;
    $('#topic').replaceChildren();
    const first = el('option', '', t('topicAny')); first.value = ''; $('#topic').append(first);
    t('courses').forEach(c => { const option = el('option', '', c.title); option.value = c.id; $('#topic').append(option); });
    $('#topic').value = selected;
    if (!$('#enquiry-result').hidden) $('#enquiry-draft').value = buildDraft();
    $('#form-status').textContent = '';
    $('#enquiry').setCustomValidity('');
    if (save) { try { localStorage.setItem('acumelo.language', lang); } catch {} }
  }
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!$('#enquiry').value.trim()) {
      $('#enquiry').setCustomValidity(t('required')); $('#enquiry').reportValidity(); return;
    }
    $('#enquiry-draft').value = buildDraft();
    $('#enquiry-result').hidden = false;
    $('#form-status').textContent = t('prepared');
    $('#enquiry-draft').focus();
  });
  form.addEventListener('input', () => {
    $('#enquiry').setCustomValidity('');
    if (!$('#enquiry-result').hidden) $('#enquiry-draft').value = buildDraft();
    $('#form-status').textContent = '';
  });
  $('#topic').addEventListener('change', () => { if (!$('#enquiry-result').hidden) $('#enquiry-draft').value = buildDraft(); });
  $('#copy-enquiry').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText($('#enquiry-draft').value);
      $('#form-status').textContent = t('copied');
    } catch {
      $('#enquiry-draft').focus(); $('#enquiry-draft').select();
      $('#form-status').textContent = t('copyFallback');
    }
  });
  Object.entries(content.assets).forEach(([name,asset]) => {
    if (name === 'intro') return;
    if (!asset.src && !asset.video) return;
    if (name === 'logo') {
      document.querySelectorAll('.wordmark').forEach(mark => {
        const logo = el('img', 'brand-image');
        logo.src = asset.src; logo.alt = 'Acumelo';
        logo.width = 654; logo.height = 331;
        mark.replaceChildren(logo);
      });
      return;
    }
    const slot = document.querySelector('[data-image-slot="'+name+'"]');
    if (!slot) return;
    slot.classList.add('has-media');
    if (asset.video) {
      // Future showreels are user-controlled and never autoplay or play audio by default.
      slot.removeAttribute('aria-hidden');
      const video = el('video', 'slot-photo');
      video.src = asset.video; video.controls = true; video.muted = true;
      video.playsInline = true; video.preload = 'none';
      video.poster = asset.poster || asset.src || '';
      video.dataset.label = name + 'MediaLabel';
      video.setAttribute('aria-label', t(name + 'MediaLabel'));
      video.style.objectPosition = asset.position || '50% 50%';
      slot.replaceChildren(video);
    } else {
      const image = el('img','slot-photo'); image.alt = ''; image.src = asset.src;
      image.style.objectPosition = asset.position || '50% 50%';
      if (name !== 'hero') image.loading = 'lazy';
      slot.replaceChildren(image);
    }
  });
  setLanguage(lang, false);
  showPage(pageFromLocation());
})();
