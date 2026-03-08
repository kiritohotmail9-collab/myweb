let slideIndex=0
let slides=[]

function loadHomeBanner(){

const album=JSON.parse(localStorage.getItem("album")) || []

const now=new Date()

const month=now.getMonth()
const year=now.getFullYear()

slides=album.filter(p=>p.month==month && p.year==year)

const slideContainer=document.getElementById("homeSlides")
const dotContainer=document.getElementById("homeDots")

slideContainer.innerHTML=""
dotContainer.innerHTML=""

slides.forEach((photo,i)=>{

const img=document.createElement("img")

img.src=photo.data
img.className="slide"

if(i===0) img.classList.add("active")

slideContainer.appendChild(img)

const dot=document.createElement("span")
dot.className="dot"

dot.onclick=()=>showSlide(i)

dotContainer.appendChild(dot)

})

}

function showSlide(n){

const slideEls=document.querySelectorAll(".slide")
const dotEls=document.querySelectorAll(".dot")

slideIndex=n

if(slideIndex>=slideEls.length) slideIndex=0
if(slideIndex<0) slideIndex=slideEls.length-1

slideEls.forEach(s=>s.classList.remove("active"))
dotEls.forEach(d=>d.classList.remove("active"))

slideEls[slideIndex].classList.add("active")
dotEls[slideIndex].classList.add("active")

}

function nextSlide(){
showSlide(slideIndex+1)
}

function prevSlide(){
showSlide(slideIndex-1)
}

setInterval(()=>{
nextSlide()
},5000)

loadHomeBanner()
