
const searchinp=document.querySelector(".search-input");
searchinp.addEventListener('input',(e)=>{
    for(let camp of campgrounds.features){
        if(camp.title.toLowerCase().search(searchinp.value.toLowerCase()) == -1){
            const campClass=`.camp-${camp._id}`
            const notResults=document.querySelectorAll(campClass)
            for(let r of notResults){
                r.classList.add('displayNone')
            }
        }else{
            const campClass=`.camp-${camp._id}`
            const results=document.querySelectorAll(campClass)
            for(let r of results){
                r.classList.remove('displayNone')
            }
        }
    }
})