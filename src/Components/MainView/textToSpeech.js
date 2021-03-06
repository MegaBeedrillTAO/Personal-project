export default function Speak(text){
  var synthesis = window.speechSynthesis;

 
  var voice = synthesis.getVoices().filter(function(voice) {
    return voice.lang === 'en';
  })[0];
  
  
  

  var utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.pitch = 1.5;
  utterance.rate = 1;
  utterance.volume = 0.8;
  synthesis.speak(utterance);

}