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
  let selectedTeachingField = '';
  const pages = ['home', 'lectures', 'people', 'about', 'contact', 'library', ...courseIds, ...instructorIds];
  const library = el('section', 'section media-library');
  library.id = 'library'; library.hidden = true;
  $('#lectures').after(library);
  const mediaKinds = [['lecture', 'mediaLecture'], ['demo', 'mediaDemo'], ['project', 'mediaProject']];
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
  function showPage(page, focus = false) {
    pauseVideos();
    activePage = pages.includes(page) ? page : 'home';
    toggleMenu(false);
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
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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
      if (activePage !== page) {
        try { history.pushState({ page }, '', pageUrl(page)); }
        catch { location.href = link.href; return; }
      }
      showPage(page, true);
  });
  window.addEventListener('popstate', () => showPage(pageFromLocation(), true));
  function pageLink(page, text, className = '') {
    const link = el('a', className, text);
    link.href = '?page=' + page;
    link.dataset.pageLink = page;
    return link;
  }
  function renderCourses() {
    const list = $('#course-list');
    list.replaceChildren();
    t('courses').forEach((c, i) => {
      const article = el('article', 'course');
      article.dataset.courseId = c.id;
      const link = pageLink(c.id, undefined, 'course-link');
      const number = el('span', 'course-number', String(i + 1).padStart(2, '0'));
      number.setAttribute('aria-hidden', 'true');
      const title = el('div', 'course-title');
      title.append(el('span', 'small-caps', c.tag), el('h2', '', c.title), el('span', 'course-view', t('courseView')));
      const arrow = el('span', 'course-arrow', '→'); arrow.setAttribute('aria-hidden', 'true');
      const summary = el('div', 'course-summary');
      summary.append(el('p', '', c.problem), el('span', 'course-output-label', t('courseRepresentativeOutput')), el('p', 'course-output-short', c.shortOutput));
      link.append(number, title, summary, arrow);
      article.append(link); list.append(article);
    });
    renderCoursePages();
    updatePageLinks();
  }
  function renderCoursePages() {
    t('courses').forEach((c, i) => {
      const section = document.getElementById(c.id);
      section.replaceChildren();
      const breadcrumb = el('div', 'section-heading');
      breadcrumb.append(pageLink('lectures', t('courseBack'), 'course-back'), el('span', 'small-caps', c.tag));
      const header = el('header', 'course-header');
      const heading = el('h1', 'page-title', c.title);
      heading.id = c.id + '-title'; section.setAttribute('aria-labelledby', heading.id);
      header.append(el('p', 'small-caps', t('courseProposal') + ' / ' + String(i + 1).padStart(2, '0')), heading, el('p', 'course-lead', c.subtitle), el('p', 'course-description', c.body));
      const intro = el('div', 'course-overview');
      const learning = el('div'), goals = el('ul', 'course-goals');
      c.learning.forEach(goal => goals.append(el('li', '', goal)));
      learning.append(el('h2', '', t('courseLearning')), goals);
      const audience = el('aside', 'course-audience');
      audience.append(el('h2', '', t('courseAudience')), el('p', '', c.audience), el('h2', 'prerequisite-title', t('coursePrerequisites')), el('p', '', c.prerequisites));
      intro.append(learning, audience);
      const curriculum = el('div', 'curriculum');
      curriculum.append(el('h2', '', t('courseCurriculum')), el('p', 'curriculum-note', t('curriculumNote')));
      const modules = el('ol', 'curriculum-list');
      c.curriculum.forEach((step, index) => {
        const item = el('li', 'curriculum-module'), body = el('div');
        const number = el('span', 'module-number', String(index + 1).padStart(2, '0')); number.setAttribute('aria-hidden', 'true');
        const practice = el('p', 'module-practice');
        practice.append(el('span', '', t('coursePractice')), document.createTextNode(step[2]));
        body.append(el('h3', '', step[0]), el('p', '', step[1]), practice);
        item.append(number, body); modules.append(item);
      });
      curriculum.append(modules);
      const outcome = el('div', 'course-outcome');
      outcome.append(el('p', 'small-caps', t('outputLabel')), el('p', '', c.output));
      section.append(breadcrumb, header, intro, curriculum, outcome);
      if (c.id === 'development') {
        const extension = el('div', 'course-extension');
        extension.append(el('p', 'small-caps', 'UNITY · UNREAL ENGINE'), el('h2', '', t('courseExtension')), el('p', '', t('courseExtensionBody')));
        section.append(extension);
      }
      const format = el('div', 'course-format');
      const enquiry = pageLink('contact', t('courseEnquiry') + ' →', 'line-link');
      enquiry.dataset.course = c.id;
      format.append(el('h2', '', t('courseFormat')), el('p', '', t('courseFormatBody')), enquiry);
      const instructors = content.members.filter(member => member.teachingFieldIds.includes(c.id));
      const connection = el('div', 'course-instructor');
      connection.append(el('h2', 'small-caps', t('courseInstructorConfirmed')));
      const instructorLinks = el('div', 'course-instructor-links');
      instructors.forEach(member => instructorLinks.append(pageLink(member.id, (member.name[lang] || t('memberPending')) + ' →', 'line-link')));
      if (!instructors.length) instructorLinks.append(el('p', 'small', t('filterEmpty')));
      connection.append(instructorLinks);
      const film = el('div', 'course-film');
      film.append(el('h2', '', t('courseVideo')), el('p', 'portfolio-note', t('mediaExampleNotice')), courseMediaGrid(c), pageLink('library', t('mediaLibraryExplore'), 'line-link'));
      const other = el('nav', 'course-related'); other.setAttribute('aria-label', t('courseOther'));
      other.append(el('p', 'small-caps', t('courseOther')));
      t('courses').filter(course => course.id !== c.id).forEach(course => other.append(pageLink(course.id, course.title + ' →')));
      section.append(format, connection, film, other);
    });
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
    if (asset.description?.[lang]) descriptions.push(asset.description[lang]);
    if (descriptions.length) {
      const description = el('p', 'media-description', descriptions.join(' '));
      description.id = 'media-description-' + (++mediaDescriptionId);
      if (player) player.setAttribute('aria-describedby', description.id);
      card.append(description);
    }
    if (asset.transcript?.[lang]) {
      const details = el('details', 'media-transcript');
      details.append(el('summary', '', t('mediaTranscript')), el('p', '', asset.transcript[lang]));
      card.append(details);
    }
    if (asset.transcriptSrc) {
      const transcript = el('a', 'line-link media-transcript-link', t('mediaFullTranscript'));
      transcript.href = asset.transcriptSrc;
      transcript.target = '_blank'; transcript.rel = 'noopener noreferrer';
      card.append(transcript);
    }
    if (hasLink) {
      const link = el('a', 'line-link', t(project ? 'projectOpen' : 'mediaOpen') + ' ↗');
      link.href = asset.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; card.append(link);
    }
    return card;
  }
  function courseMediaAsset(course, kind) {
    return content.courseMedia[course.id]?.[kind] || {};
  }
  function courseMediaGrid(course) {
    const grid = el('div', 'course-media-grid');
    for (const [kind, label] of mediaKinds) {
      const asset = courseMediaAsset(course, kind);
      const card = mediaCard(asset, asset.title?.[lang] || t(label), kind === 'project');
      card.dataset.mediaKind = kind; grid.append(card);
    }
    return grid;
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
    for (const course of t('courses')) {
      const group = el('section', 'library-field'); group.dataset.fieldId = course.id;
      const title = el('h2'); title.append(pageLink(course.id, course.title));
      group.append(title, courseMediaGrid(course)); library.append(group);
    }
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
      const link = pageLink(member.id, undefined, 'member-link');
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
    content.members.forEach((member, i) => renderInstructorPage(member, i));
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
    text.append(el('h2', 'profile-fields-title', t('profileSpecialty')));
    text.append(courses.length ? fieldTags(member.teachingFieldIds, true) : el('p', 'profile-pending', t('teachingFieldsPending')));
    if (!member.name[lang]) text.append(el('p', 'profile-pending', t('profilePendingNote')));
    hero.append(memberVisual(member), text);
    const biography = el('div', 'profile-biography');
    const bio = el('div'), career = el('div');
    bio.append(el('h2', '', t('profileAbout')), el('p', '', member.bio[lang] || t('profileAboutPending')));
    career.append(el('h2', '', t('profileCareer')), el('p', '', member.career[lang] || t('profileCareerPending')));
    biography.append(bio, career);
    const connection = el('div', 'profile-programme');
    connection.append(el('h2', '', t('profileCourse')));
    courses.forEach(course => {
      const item = el('article', 'profile-programme-item');
      const title = el('h3'); title.append(pageLink(course.id, course.title + ' →', 'profile-course-link'));
      const enquiry = pageLink('contact', t('courseEnquiry') + ' →', 'line-link'); enquiry.dataset.course = course.id;
      item.append(title, el('p', '', course.problem), enquiry); connection.append(item);
    });
    if (!courses.length) connection.append(el('p', '', t('profileCoursesPending')));
    // Instructor demos never fall back to the shared field montages.
    const ownDemo = el('section', 'profile-own-demo');
    ownDemo.dataset.mediaGroup = 'instructor-demo';
    ownDemo.append(el('h2', '', t('profileOwnDemo')), el('p', 'portfolio-note', t('profileOwnDemoNote')));
    const demo = member.media?.demo || {};
    ownDemo.append(mediaCard(demo, demo.title?.[lang] || t('profileOwnDemo')));
    if (!demo.src && !demo.url) ownDemo.append(el('p', 'profile-pending', t('profileOwnDemoPending')));
    const projects = el('section', 'profile-field-projects');
    projects.dataset.mediaGroup = 'field-projects';
    projects.append(el('h2', '', t('profileFieldProjects')), el('p', 'portfolio-note', t('profileFieldProjectsNote')));
    const grid = el('div', 'portfolio-grid');
    courses.forEach(course => {
      const asset = courseMediaAsset(course, 'project');
      const card = mediaCard(asset, course.title + ' · ' + t('mediaProject'), true);
      card.append(fieldTags([course.id], true)); grid.append(card);
    });
    projects.append(grid, pageLink('library', t('mediaLibraryExplore'), 'line-link media-library-link'));
    const lecture = el('section', 'profile-teaching-film');
    lecture.dataset.mediaGroup = 'lecture';
    lecture.append(el('h2', '', t('mediaLecture')), el('p', 'portfolio-note', t('profileTeachingFilmNote')),
      mediaCard(member.media?.lecture || {}, t('mediaLecture')));
    section.append(breadcrumb, hero, ownDemo, biography, connection, projects, lecture);
  }
  function buildDraft() {
    const org = $('#organization').value.trim() || t('notProvided');
    const selected = t('courses').find(c => c.id === $('#topic').value);
    const topic = selected ? selected.title + ' / ' + selected.subtitle : t('topicAny');
    return [t('subject'), '', t('formOrganization') + ': ' + org, t('formTopic') + ': ' + topic, '', t('draftBodyLabel'), $('#enquiry').value.trim()].join('\n');
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
    renderCourses(); renderSequences(); renderPeople(); renderMediaLibrary();
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
