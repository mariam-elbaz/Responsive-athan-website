
let cities = ['Mansoura', 'Suhaj', "Bur Sa'id", 'Qina', 'Aswan', 'Alexandria', 'Giza'];

        //[0] location
        let select = document.querySelector('.cities-select');
        cities.forEach(city =>{ select.innerHTML +=`<option> ${city} </option>`});

        select.addEventListener('change', function(){
                console.log(this.value);
                getAthanByCity(this.value);
        });

function getAthanByCity(city){
        fetch(`http://api.aladhan.com/v1/timingsByCity?country=EG&city=${city}`)
.then((athanData) =>(athanData.json()))
.then((athanData)=>{
console.log(athanData);

        //arr of all athan arrays    
        let  allAthanArr = Object.entries(athanData.data.timings).filter(([athan, time]) =>athan =='Fajr' || athan =='Sunrise' || athan =='Dhuhr'|| athan =='Asr' || athan =='Maghrib' || athan =='Isha')
        console.log(allAthanArr);

        // find the next athan 
        let [nextAthan, nextTime] = allAthanArr.find(([athan, time]) => convertTimeToMin(time) > getTimeNow());
        console.log(nextAthan, nextTime);

        // find the previous athan 
        let [prevtAthan, prevTime] = allAthanArr.filter(([athan, time]) => convertTimeToMin(time) < getTimeNow()).slice(-1)[0];
        console.log(prevtAthan, prevTime);


        // [1] set the next athan
        document.querySelector('.next-athan-title').innerHTML  = nextAthan;
        document.querySelector('.next-athan-time').innerHTML = nextTime;


        // [2] change bg
        if(prevTime){
                if(prevtAthan === "Fajr"){
                        setColors("4b6bb7dc", "C9D6FF");
                }
                else if(prevtAthan === "Sunrise"){
                        setColors("FFA07A", "ffd9004d");
                }
                else if(prevtAthan === "Dhuhr"){
                        setColors("ffdb10d1", "87CEFA");
                }
                else if(prevtAthan === "Asr"){
                        setColors("ff6347a6", "f4a30099");
                }
                else if(prevtAthan === "Maghrib"){
                        setColors("ff6347ab", "8000809e");
                }
                else if(prevtAthan === "Isha"){
                        setColors("1a1a70e6", "00000099");
                }     
        }
                

        // [3] set today date 
        document.querySelector('.today-date').innerHTML =`${athanData.data.date.readable}`;

  

//-----------------------------------cards-----------------------
    // append athan to cards
    let cardsContainer = document.querySelector('.cards-container');
    cardsContainer.innerHTML = '';

    allAthanArr.forEach( ([athan, time]) => { 
        let athanInfo = document.createElement('div');

        athanInfo.classList.add('athan-info', 'blur-box');
        athanInfo.innerHTML =`
                <h3 class="athan-title blur">${athan}</h3>
                <div class="athan-time">${time}</div>  
        `;
        cardsContainer.append(athanInfo);
      });

});
};
getAthanByCity('Mansoura');




// ---------------------------funs
function getTimeNow(){
        const currentDate = new Date();
        let currentHour = currentDate.getHours();
        let currentMinute = currentDate.getMinutes();

        return currentHour *60  + currentMinute;
}

function convertTimeToMin(time){
        let [hours, minutes] = time.split(':').map(Number);
        return  hours * 60 + minutes;
}

function setColors(color1, color2){
        document.body.style.background = `linear-gradient(-135deg, #${color1}, #${color2})`
}