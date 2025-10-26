// Story data
const scenes = [
  { title:'Confession', text:"The night I confessed, what did I told you?", A:"Choose someone who prioritizes you.", B:"Do you like me?", correct:'A', image:'s1.jpg' },
  { title:'Confession', text:"After that confession, this is what I told you.", A:"I'll do my best for us, Ivie.", B:"I'll prove myself, Ivie.", correct:'B', image:'s2.jpg' },
  { title:'Tomorrow morning', text:"Kinabukasan sinabi ko na..", A:"Ipapanalo kita.", B:"Hi loveyyy!", correct:'A', image:'s3.jpg' },
  { title:'Hobby', text:"Kapag active ako pero 'di nakakapagreply, ano ginagawa ko?", A:"Watching reels.", B:"Playing games.", correct:'A', image:'s4.jpg' },
  { title:'Hobby', text:"What do I always do?", A:"Pikunin ka", B:"Play games", correct:'A', image:'s5.jpg' },
  { title:'Name', text:"What's my name?", A:"Shawn", B:"Sean", correct:'B', image:'s6.jpg' },
  { title:'Cs', text:"What does baobei means?", A:"treasure", B:"home", correct:'A', image:'s7.jpg' },
  { title:'Sudden', text:"Which of these did I told you?", A:"I just love the fact that there's someone who cares for me.", B:"I just love the fact that there's someone who's in love with me for being me.", correct:'B', image:'s8.jpg' },
  { title:'Answer', text:"When you asked me, 'kaso nameet mo abnormal, ayos lang ba?'. I said?", A:"Ofc, I'm also crazy.", B:"I love your goofiness.", correct:'B', image:'s9.jpg' },
  { title:'Confession', text:"You are my?", A:"girl", B:"Iris", correct:'B', image:'s10.jpg' }
];

const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const sceneTitle = document.getElementById('sceneTitle');
const sceneText = document.getElementById('sceneText');
const choicesDiv = document.getElementById('choices');
const sceneImage = document.getElementById('sceneImage');
const angryGif = document.getElementById('angryGif');
const mediaArea = document.getElementById('mediaArea');
const bgMusic = document.getElementById('bgMusic');
const finalScreen = document.getElementById('finalScreen');
const replayBtn = document.getElementById('replayBtn');
const shareBtn = document.getElementById('shareBtn');
const heartsContainer = document.getElementById('hearts');

let index = 0;
let answeredCorrect = false;

// Floating hearts
function createHearts(){
  for(let i=0;i<12;i++){
    const s = document.createElement('span');
    s.style.left = (Math.random()*100) + 'vw';
    s.style.animationDuration = (6 + Math.random()*6) + 's';
    s.style.opacity = Math.random()*0.7 + 0.2;
    heartsContainer.appendChild(s);
  }
}

// Render scene
function renderScene(i){
  const s = scenes[i];
  sceneTitle.textContent = s.title;
  sceneText.textContent = s.text;
  choicesDiv.innerHTML = '';
  hideMedia();

  const choiceA = document.createElement('button');
  choiceA.className = 'choice';
  choiceA.textContent = 'A — ' + s.A;
  choiceA.dataset.choice = 'A';
  const choiceB = document.createElement('button');
  choiceB.className = 'choice';
  choiceB.textContent = 'B — ' + s.B;
  choiceB.dataset.choice = 'B';

  choiceA.addEventListener('click', onChoose);
  choiceB.addEventListener('click', onChoose);

  choicesDiv.appendChild(choiceA);
  choicesDiv.appendChild(choiceB);

  nextBtn.style.display = 'none';
  answeredCorrect = false;

  // ✅ Scroll into view (fix for mobile)
  nextBtn.scrollIntoView({behavior:'smooth', block:'center'});
}

// Handle choices
function onChoose(e){
  const chosen = e.currentTarget.dataset.choice;
  const s = scenes[index];
  if(answeredCorrect) return;

  if(chosen === s.correct){
    e.currentTarget.classList.add('correct');
    showSceneImage(s.image);
    answeredCorrect = true;
    nextBtn.style.display = 'inline-block';
  } else {
    e.currentTarget.classList.add('wrong');
    showAngryGif();
  }
}

function showSceneImage(src){
  angryGif.style.display = 'none';
  sceneImage.src = src;
  sceneImage.alt = 'Memory screenshot';
  sceneImage.style.display = 'block';
  requestAnimationFrame(()=> {
    sceneImage.style.opacity = '1';
    sceneImage.style.transform = 'translateY(0)';
  });
  mediaArea.setAttribute('aria-hidden','false');
}

function showAngryGif(){
  sceneImage.style.display = 'none';
  angryGif.style.display = 'block';
  angryGif.style.opacity = '0';
  angryGif.style.transform = 'translateY(6px)';
  mediaArea.setAttribute('aria-hidden','false');
  requestAnimationFrame(()=> {
    angryGif.style.opacity = '1';
    angryGif.style.transform = 'translateY(0)';
  });
  choicesDiv.classList.add('shake');
  setTimeout(()=> choicesDiv.classList.remove('shake'), 420);
}

function hideMedia(){
  sceneImage.style.opacity = '0';
  sceneImage.style.display = 'none';
  angryGif.style.opacity = '0';
  angryGif.style.display = 'none';
  mediaArea.setAttribute('aria-hidden','true');
}

// Start game
startBtn.addEventListener('click', ()=>{
  startBtn.style.display = 'none';
  bgMusic.play().catch(()=>{});
  createHearts();
  renderScene(0);
});

// Next scene
nextBtn.addEventListener('click', ()=>{
  if(!answeredCorrect) return;
  index++;
  if(index < scenes.length){
    renderScene(index);
  } else {
    showFinal();
  }
});

function showFinal(){
  document.querySelector('.stage').style.display = 'none';
  finalScreen.classList.add('show');
  finalScreen.setAttribute('aria-hidden','false');
}

replayBtn.addEventListener('click', ()=>{
  index = 0;
  finalScreen.classList.remove('show');
  document.querySelector('.stage').style.display = 'flex';
  renderScene(0);
});

shareBtn.addEventListener('click', ()=>{
  navigator.clipboard.writeText(location.href).then(()=> alert('Link copied — share it with Ivie!'));
});

// shake CSS
const style = document.createElement('style');
style.textContent = `
.choices.shake{animation:shake .42s}
@keyframes shake{10%{transform:translateX(-6px)}30%{transform:translateX(6px)}50%{transform:translateX(-4px)}70%{transform:translateX(4px)}90%{transform:translateX(-2px)}}
`;
document.head.appendChild(style);

// Enter key support
document.addEventListener('keydown',(e)=>{
  if(e.key === 'Enter'){
    const active = document.activeElement;
    if(active && active.classList && active.classList.contains('choice')){
      active.click();
    } else if(nextBtn.style.display !== 'none' && document.activeElement === nextBtn){
      nextBtn.click();
    }
  }
});
