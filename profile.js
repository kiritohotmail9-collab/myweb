function calculateAge(birthday){

const birth=new Date(birthday)
const today=new Date()

let age=today.getFullYear()-birth.getFullYear()

const m=today.getMonth()-birth.getMonth()

if(m<0 || (m===0 && today.getDate()<birth.getDate())){
age--
}

return age

}

function loadProfile(){

const data=JSON.parse(localStorage.getItem("profile")) || {}

const name=document.getElementById("profileName")
if(name) name.innerText=data.name || "No Name"

const age=document.getElementById("profileAge")
const birth=document.getElementById("profileBirthday")

if(data.birthday){

const a=calculateAge(data.birthday)

if(age) age.innerText=a
if(birth) birth.innerText=data.birthday

}

const img=document.getElementById("profileImage")
if(img && data.image){
img.src=data.image
}

}

function openProfileEdit(){

const data=JSON.parse(localStorage.getItem("profile")) || {}

document.getElementById("editName").value=data.name || ""
document.getElementById("editBirthday").value=data.birthday || ""
document.getElementById("editEducation").value=data.education || ""

document.getElementById("profileModal").classList.add("show")

}


function closeProfileEdit(){

document.getElementById("profileModal").classList.remove("show")

}


function saveProfile(){

const data={

name:document.getElementById("editName").value,
birthday:document.getElementById("editBirthday").value,
education:document.getElementById("editEducation").value,

}

const old=JSON.parse(localStorage.getItem("profile")) || {}

data.image=old.image || ""

localStorage.setItem("profile",JSON.stringify(data))

closeProfileEdit()

loadProfile()

}


/* upload profile image */

document.getElementById("profileUpload").onchange=function(e){

const file=e.target.files[0]

const reader=new FileReader()

reader.onload=function(){

const data=JSON.parse(localStorage.getItem("profile")) || {}

data.image=reader.result

localStorage.setItem("profile",JSON.stringify(data))

loadProfile()

}

reader.readAsDataURL(file)

}


function deletePhoto(index){

const album=JSON.parse(localStorage.getItem("album")) || []

album.splice(index,1)

localStorage.setItem("album",JSON.stringify(album))

loadMonthFilter()
loadAlbum()

}


loadProfile()
loadMonthFilter()
loadAlbum()

function getMonthName(m){

const months=[
"January","February","March","April",
"May","June","July","August",
"September","October","November","December"
]

return months[m]

}

function loadMonthFilter(){

const select=document.getElementById("albumMonthFilter")

const album=JSON.parse(localStorage.getItem("album")) || []

const months=new Set()

album.forEach(p=>{
if(p.year!==undefined){
months.add(p.year+"-"+p.month)
}
})

select.innerHTML=""

months.forEach(m=>{

const [y,mo]=m.split("-")

const option=document.createElement("option")

option.value=m

option.innerText=getMonthName(Number(mo))+" "+y

select.appendChild(option)

})

}

function loadAlbum(){

const album=JSON.parse(localStorage.getItem("album")) || []

const grid=document.getElementById("albumGrid")

const filter=document.getElementById("albumMonthFilter").value || ""

grid.innerHTML=""

album.forEach((photo,index)=>{

if(filter){

const [y,m]=filter.split("-")

if(photo.year!=y || photo.month!=Number(m)) return

}

const div=document.createElement("div")

div.className="album-item"

div.innerHTML=`

<img src="${photo.data}" onclick="viewPhoto('${photo.data}')">

<button onclick="deletePhoto(${index})">🗑</button>

`

grid.appendChild(div)

})

}

document.getElementById("albumUpload").onchange=function(e){

const files=e.target.files
const album=JSON.parse(localStorage.getItem("album")) || []

const now=new Date()

Array.from(files).forEach(file=>{

const reader=new FileReader()

reader.onload=function(){

album.push({

data:reader.result,
month:now.getMonth(),
year:now.getFullYear()

})

localStorage.setItem("album",JSON.stringify(album))

loadMonthFilter()
loadAlbum()


}

reader.readAsDataURL(file)

})

}


let currentIndex=0
let albumData=[]

function viewPhoto(src){

albumData=JSON.parse(localStorage.getItem("album")) || []

currentIndex=albumData.findIndex(p=>p.data===src)

showSlide()

document.getElementById("photoViewer").style.display="flex"

}

function showSlide(){

const img=document.getElementById("viewerImg")

img.src=albumData[currentIndex].data

}

function nextPhoto(){

currentIndex++

if(currentIndex>=albumData.length){
currentIndex=0
}

showSlide()

}

function prevPhoto(){

currentIndex--

if(currentIndex<0){
currentIndex=albumData.length-1
}

showSlide()

}


function closeViewer(){

document.getElementById("photoViewer").style.display="none"

}

function openFamilyEdit(){
document.getElementById("familyModal").classList.add("show")
}

function closeFamilyEdit(){
document.getElementById("familyModal").classList.remove("show")
}

function saveFamily(){

const name=document.getElementById("familyName").value
const relation=document.getElementById("familyRelation").value
const birthday=document.getElementById("familyBirthday").value
const imageFile=document.getElementById("familyImage").files[0]

const family=JSON.parse(localStorage.getItem("family")) || []

if(imageFile){

const reader=new FileReader()

reader.onload=function(){

family.push({
name:name,
relation:relation,
birthday:birthday,
image:reader.result
})

localStorage.setItem("family",JSON.stringify(family))

loadFamily()

}

reader.readAsDataURL(imageFile)

}else{

family.push({
name:name,
relation:relation,
birthday:birthday
})

localStorage.setItem("family",JSON.stringify(family))

loadFamily()

}

closeFamilyEdit()

}

function loadFamily(){

const family=JSON.parse(localStorage.getItem("family")) || []

const grid=document.getElementById("familyGrid")

grid.innerHTML=""

family.forEach((p,index)=>{

let age=""

if(p.birthday){
age=calculateAge(p.birthday)
}

const div=document.createElement("div")

div.className="family-card"

div.innerHTML=`

<img src="${p.image || 'default-avatar.png'}">

<h3>${p.name}</h3>

<p>${p.relation}</p>

<p>Age : ${age}</p>

<button onclick="deleteFamily(${index})">Delete</button>

`

grid.appendChild(div)

})

}

function deleteFamily(index){

const family=JSON.parse(localStorage.getItem("family")) || []

family.splice(index,1)

localStorage.setItem("family",JSON.stringify(family))

loadFamily()

}

loadFamily()

function openEduPopup(){

document.getElementById("eduModal").classList.add("show")

}

function closeEduPopup(){

document.getElementById("eduModal").classList.remove("show")

}

function saveEducation(){

let level=document.getElementById("eduLevel").value
let school=document.getElementById("eduSchool").value
let gpa=document.getElementById("eduGpa").value
let field=document.getElementById("eduField").value

let data=JSON.parse(localStorage.getItem("education")) || []

data.push({

level,
school,
gpa,
field

})

localStorage.setItem("education",JSON.stringify(data))

closeEduPopup()

loadEducation()

}

function loadEducation(){

let list=document.getElementById("educationList")

let data=JSON.parse(localStorage.getItem("education")) || []

list.innerHTML=""

data.forEach((edu,i)=>{

let div=document.createElement("div")

div.className="edu-card"

div.innerHTML=`

<h4>${edu.level}</h4>
<p>${edu.school}</p>
<p>เกรด: ${edu.gpa}</p>
<p>${edu.field}</p>

<div class="edu-actions">

<button class="icon-btn edit" onclick="editEducation(${i})">✏️</button>
<button class="icon-btn delete" onclick="deleteEducation(${i})">🗑</button>

</div>

`

list.appendChild(div)

})

}


loadEducation()

loadMonthFilter()
loadAlbum()


window.onload=function(){
loadProfile()
loadMonthFilter()
loadAlbum()
loadFamily()
loadEducation()
}

function deleteEducation(index){

let data=JSON.parse(localStorage.getItem("education")) || []

data.splice(index,1)

localStorage.setItem("education",JSON.stringify(data))

loadEducation()

}

function editEducation(index){

let data=JSON.parse(localStorage.getItem("education")) || []

let edu=data[index]

document.getElementById("eduLevel").value=edu.level
document.getElementById("eduSchool").value=edu.school
document.getElementById("eduGpa").value=edu.gpa
document.getElementById("eduField").value=edu.field

data.splice(index,1)

localStorage.setItem("education",JSON.stringify(data))

openEduPopup()

}


document.getElementById("profileUpload").onchange=function(e){

const file=e.target.files[0]
const reader=new FileReader()

reader.onload=function(){

const data=JSON.parse(localStorage.getItem("profile")) || {}

data.image=reader.result

localStorage.setItem("profile",JSON.stringify(data))

loadProfile()

}

reader.readAsDataURL(file)

}


document.getElementById("albumUpload").onchange=function(e){

const files=e.target.files
const album=JSON.parse(localStorage.getItem("album")) || []
const now=new Date()

Array.from(files).forEach(file=>{

const reader=new FileReader()

reader.onload=function(){

album.push({

data:reader.result,
month:now.getMonth(),
year:now.getFullYear()

})

localStorage.setItem("album",JSON.stringify(album))

loadMonthFilter()
loadAlbum()

}

reader.readAsDataURL(file)

})

}

