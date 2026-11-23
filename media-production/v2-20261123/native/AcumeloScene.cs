using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using System.IO;
public class AcumeloScene {
  public static void Build() {
    string root=Directory.GetParent(Application.dataPath).FullName;
    string output=Path.Combine(root,"Captures");Directory.CreateDirectory(output);
    EditorSceneManager.NewScene(NewSceneSetup.EmptyScene,NewSceneMode.Single);
    RenderSettings.ambientLight=new Color(.35f,.4f,.55f);
    var camera=new GameObject("Showcase camera").AddComponent<Camera>();camera.clearFlags=CameraClearFlags.SolidColor;camera.backgroundColor=new Color(.025f,.035f,.08f);camera.fieldOfView=48;
    var key=new GameObject("Key light").AddComponent<Light>();key.type=LightType.Directional;key.intensity=1.4f;key.transform.rotation=Quaternion.Euler(45,-35,0);
    Color[] palette={new Color(.1f,.38f,1),new Color(1,.3f,.23f),new Color(.2f,.9f,.75f)};
    for(int i=0;i<25;i++) {
      var o=GameObject.CreatePrimitive(i%3==0?PrimitiveType.Sphere:PrimitiveType.Cube);
      o.name="Interactive module "+i;o.transform.position=new Vector3((i%5-2)*1.5f,.5f+Mathf.Sin(i)*.25f,(i/5-2)*1.5f);
      o.transform.localScale=new Vector3(.9f,.5f+i%4*.4f,.9f);
      var m=new Material(Shader.Find("Standard"));m.color=palette[i%3];m.SetFloat("_Metallic",.35f);m.SetFloat("_Glossiness",.75f);o.GetComponent<Renderer>().sharedMaterial=m;
    }
    var floor=GameObject.CreatePrimitive(PrimitiveType.Plane);floor.transform.localScale=Vector3.one*2;
    var fm=new Material(Shader.Find("Standard"));fm.color=new Color(.12f,.15f,.22f);floor.GetComponent<Renderer>().sharedMaterial=fm;
    EditorSceneManager.SaveScene(UnityEngine.SceneManagement.SceneManager.GetActiveScene(),"Assets/AcumeloInteractive.unity");
    for(int f=0;f<24;f++) {
      float a=f*.018f+.5f;camera.transform.position=new Vector3(10*Mathf.Sin(a),6,-10*Mathf.Cos(a));camera.transform.LookAt(new Vector3(0,.5f,0));
      var rt=new RenderTexture(960,540,24);camera.targetTexture=rt;camera.Render();RenderTexture.active=rt;
      var tex=new Texture2D(960,540,TextureFormat.RGB24,false);tex.ReadPixels(new Rect(0,0,960,540),0,0);tex.Apply();File.WriteAllBytes(Path.Combine(output,f.ToString("000")+".jpg"),tex.EncodeToJPG(90));
      camera.targetTexture=null;RenderTexture.active=null;Object.DestroyImmediate(rt);Object.DestroyImmediate(tex);
    }
    Debug.Log("ACUMELO_NATIVE_UNITY_RENDER_COMPLETE");
  }
}
