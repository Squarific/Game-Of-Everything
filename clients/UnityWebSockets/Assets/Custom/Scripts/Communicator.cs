using UnityEngine;
using System.Collections;
using System;

public class Communicator : MonoBehaviour {

	public Transform ball;
	public bool testLocally = false;
	public float sendingInterval = 1f;

	private float sendingIntervalCountdown = 0;
	private string localTestCommand = null;

	void Start() {
		if(testLocally) {
			Debug.LogWarning("You are running in local testing mode!!!");
		}
		StartCoroutine(StartCommunicator());
		StartCoroutine(StartGenerateData());
	} 

	/// Use this for initialization
	IEnumerator StartCommunicator () {
		WebSocket w = new WebSocket(new Uri("ws://192.168.33.138:8080"));
		if(!testLocally) {
			yield return StartCoroutine(w.Connect());
			w.SendString("Hi there, I'm the communicator");
		}
		int i=0;
		while (true)
		{
			sendingIntervalCountdown -= Time.deltaTime;
			if(sendingIntervalCountdown < 0) {
				sendingIntervalCountdown = sendingInterval;
				String toSend = "{\"x\":"+ball.position.x+",\"y\":"+ball.position.z+",\"z\":"+ball.position.y+"}";
				Debug.Log(toSend);
				if(!testLocally) {
					w.SendString (toSend);
				}
			}
			string reply = null;
			if(!testLocally) {
				reply = w.RecvString();
			} else {
				reply = localTestCommand;
				localTestCommand = null;
			}
			if (reply != null)
			{
				Debug.Log ("Received: "+reply);
				Vector3 force = Vector3.zero;
				/*if(reply != null && reply.Length == ) {
					if(reply[0] == '#') {

					}
				}*/
				switch(reply) {
				case "jump":
					force = new Vector3(0, 300, 0);
					break;
				case "left":
					force = new Vector3(500, 0, 0);
					break;
				case "right":
					force = new Vector3(-500, 0, 0);
					break;
				case "forward":
					force = new Vector3(0, 0, 500);
					break;
				case "backward":
					force = new Vector3(0, 0, -500);
					break;
				case "color":
					force = new Vector3(0, 0, -500);
					break;
				}
				//Debug.Log (force);
				ball.GetComponent<Rigidbody>().AddForce(force);
				//w.SendString("Hi there"+i++);
			}
			if (!testLocally && w.error != null)
			{
				Debug.LogError ("Error: "+w.error);
				break;
			}
			yield return 0;
		}
		w.Close();
	}

	// Call this second client to actually send random commands.
	IEnumerator StartGenerateData () {
		WebSocket w = new WebSocket(new Uri("ws://192.168.33.138:8080"));
		if(!testLocally) {
			yield return StartCoroutine(w.Connect());
			w.SendString("Hi there, I'm the random generator");
		}
		int i=0;
		while (true)
		{
			String[] elements = {"jump", "left", "right", "forward", "backward"};
			String randomElem = elements[UnityEngine.Random.Range(0,elements.Length)];
			Debug.Log(randomElem);
			if(!testLocally) {
				w.SendString(randomElem);
			} else {
				localTestCommand = randomElem;
			}
			if (!testLocally && w.error != null)
			{
				Debug.LogError ("Error: "+w.error);
				break;
			}
			yield return new WaitForSeconds(1f);
		}
		w.Close();
	}
}
