const mongoose=require('mongoose')
const path=require('path')
const axios=require('axios')
const cities=require('./cities.js')
const seedhelpers=require('./seedhelpers.js')
const Orgs=require('../models/orgs.js')

mongoose.set('strictQuery', false)
// mongoose.connect('mongodb://127.0.0.1:27017/team2')
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Mongo Connceted------------------------");
    }).catch(()=>{
        console.log("Mongo Error-----------------------------");
    })
;
const seedDB= async function(){
    const arr=['Hospitals','Non-Profit','Blood Bank'];
    await Orgs.deleteMany({})
    // let images1= await axios.get('https://api.unsplash.com/collections/483251/photos?client_id=h3bYWrvQuF9dSSaDXPoLjA062h2m55PNnRXBJ4dqgi8&page=1&per_page=50')
    // let images2= await axios.get('https://api.unsplash.com/collections/483251/photos?client_id=h3bYWrvQuF9dSSaDXPoLjA062h2m55PNnRXBJ4dqgi8&page=1&per_page=50')
    // images1=images1.data
    // images2=images2.data
    // images=images1.concat(images2)
    // console.log(images.length)
    for(let i=0;i<300;i++){
        console.log(i)
        const cindex=Math.floor(Math.random()*1000);
        // const dindex=Math.floor(Math.random()*18);
        // const pindex=Math.floor(Math.random()*21);
        n=Math.floor(Math.random()*seedhelpers.names.length);
        const e=Math.floor(Math.random()*seedhelpers.end.length);
        const org=new Orgs({
            title:seedhelpers.names[n]+seedhelpers.end[e],
            location:`${cities[cindex].city},${cities[cindex].state}`,
            images:[
                {
                  url: 'https://media.gettyimages.com/id/182344359/photo/hospital.jpg?s=612x612&w=gi&k=20&c=ZRBwQkDUDNaHUEJmcAonowN1gZuec5NQLOS0MS-sEU8=',
                  filename: 'YelpCamp/fdm5zwrty5nvugdv02k8',
                },
                {
                  url: 'https://media.istockphoto.com/id/1312706413/photo/modern-hospital-building.jpg?s=170667a&w=0&k=20&c=o3HyNphZFQ2_2hrtcTphSLQ_2Si_tYACmEaXU1whslk=',
                  filename: 'YelpCamp/nfaejqqa2pvozg76xpwg',
                }],
            description:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed iusto voluptate et sequi, iste laudantium, adipisci itaque labore autem possimus culpa. Repellat amet animi, consectetur at iste assumenda? Est, culpa.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed iusto voluptate et sequi, iste laudantium, adipisci itaque labore autem possimus culpa. Repellat amet animi, consectetur at iste assumenda? Est, culpa.",
            price:`${Math.floor(Math.random()*20)+10}`,
            author:"6484e2da41b74fe9e2ce8a1a",
            geometry:{ type: 'Point', coordinates: [cities[cindex].longitude,cities[cindex].latitude] },
            otype:arr[Math.floor(Math.random()*arr.length)],
            website:'https://www.google.com',
            stockAvail:[{btype:'O+ve',qty:1},
            {btype:'O-ve',qty:1},{btype:'A+ve',qty:1},{btype:'A-ve',qty:1},{btype:'B+ve',qty:1},{btype:'B-ve',qty:1},{btype:'AB+ve',qty:1},{btype:'AB-ve',qty:1}   ]

        })
        await org.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
});

// axios.get('https://api.unsplash.com/collections/483251/photos?client_id=h3bYWrvQuF9dSSaDXPoLjA062h2m55PNnRXBJ4dqgi8&page=5&per_page=10').then(function(data){
//     console.log(data.data.length)
// })


//console.log(cities.length)
// console.log(descriptors.length)
// console.log(places.length)

