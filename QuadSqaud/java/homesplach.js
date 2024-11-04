//homepage intro splash//

let HomeInIntro = document.querySelector('.home-intro');
let HomeInLogo = document.querySelector('.home-intro-logo-header');
let HomeInSpan = document.querySelectorAll('.home-intro-text');

window.addEventListener('DOMContentLoaded', ()=>{

  setTimeout(()=>{

    HomeInSpan.forEach((span, idx)=>{
      setTimeout(()=>{
        span.classList.add('active');
      }, (idx + 1) * 400)
    });

    setTimeout(()=>{
      HomeInSpan.forEach((span, idx)=>{

        setTimeout(()=>{
          span.classList.remove('active');
          span.classList.add('fade');
        }, (idx + 1) * 50)
      })
    }, 2700);

    setTimeout(()=>{
      HomeInIntro.style.top = '-100vh';
    }, 2300)

    
    setTimeout(()=> {
        HomeInIntro.style.display = 'none';
      }, 2800);

  }, 700);//make the start shorter//
})