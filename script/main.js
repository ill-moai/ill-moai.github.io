function listmap_txt(map){ 
    let list =""
    for (let st of map.keys()){
        const n=map.get(st)
        if (n==1){
            list+=", "+st
        }
        else{
            list+=", "+`${n}*`+st
        }
    }
    return list .slice(2)
}

function listmap(map){ //a partir de un mapa de la forma [key=string,value=int]
//devuelve un string de la forma value_1*key_1+...+value_n*key_n
    let list =""
    for (let st of map.keys()){
        const n=map.get(st)
        if (n==1){
            list+=" + "+st
        }
        else{
            list+=" + "+`${n}*`+st
        }
    }
    return list
}

class Person {
  constructor(name) {
    this.name = name;
    this.points = new Map();} //a map with each week's points, may skip weeks
    //each value is an array [pos, neg, oth]
    //oth is an array with other points represented as strings
    totalpoints(n){
        let totalpos=0,
            totalneg=0,
            totaloth=new Map();
        for(let weeknum of this.points.keys()){
            if (weeknum<=n){
                const wk = this.points.get(weeknum)
                totalpos+=wk[0];
                totalneg+=wk[1];
                for (let st of wk[2].keys()){
                    let prev=totaloth.getOrInsert(st, 0)
                    let thisweeks=wk[2].get(st)
                    totaloth.set(st,prev+thisweeks)
                }    
            }
        }
        return [totalpos,totalneg,totaloth];
    }
    realpoints(n){
        return this.totalpoints(n)[0]-this.totalpoints(n)[1];   
    }
 
    list_other(n){
        return listmap(this.totalpoints(n)[2])
    }
    participatedwk(n){return this.points.has(n)}

    realwk(n){
        if (this.participatedwk(n)){
            return (this.points).get(n)[0]-(this.points).get(n)[1]
        }
        else {
            return "did not participate"
        }      
    }
    list_otherwk(n){
        if (this.points.has(n)){
            //return (this.points).get(n)[2].join(" + ");
            return listmap(this.points.get(n)[2])
        }
        else{
            return "did not participate"
        }      
    }
}

function mathbb(str){
    function mathbb_letter(ch){
        const upper= ["𝔸","𝔹","ℂ","𝔻","𝔼","𝔽","𝔾","ℍ","𝕀","𝕁","𝕂","𝕃","𝕄","ℕ","𝕆","ℙ","ℚ","ℝ","𝕊","𝕋","𝕌","𝕍","𝕎","𝕏","𝕐","ℤ"]
        const lower= ["𝕒","𝕓","𝕔","𝕕","𝕖","𝕗","𝕘","𝕙","𝕚","𝕛","𝕜","𝕝","𝕞","𝕟","𝕠","𝕡","𝕢","𝕣","𝕤","𝕥","𝕦","𝕧","𝕨","𝕩","𝕪","𝕫"]
        const n=ch.codePointAt(0)
        if (65<=n && n<=90) {
            return upper[n-65]
        }
        else if (97<=n && n<=122){
            return lower[n-97]
        }
        else if (ch=="Á"){
            return "𝔸́"
        }
        else if (ch=="É"){
            return "𝔼́"
        }
        else if (ch=="Í"){
            return "𝕀́"
        }
        else if (ch=="Ó"){
            return "𝕆́"
        }
        else if (ch=="Ú"){
            return "𝕌́"
        }
        else if (ch=="Ñ"){
            return "ℕ̃"
        }
        else if (ch=="á"){
            return "𝕒́"
        }
        else if (ch=="é"){
            return "𝕖́"
        }
        else if (ch=="í"){
            return "𝕚́"
        }
        else if (ch=="ó"){
            return "𝕠́"
        }
        else if (ch=="ú"){
            return "𝕦́"
        }
        else if (ch=="ñ"){
            return "𝕟̃"
        }
        else {
            return ch
        }    
    }
   let str_new="" 
   for (let ch of str){
        str_new+=mathbb_letter(ch)
   } 
   return str_new
}
function week(n){
    if (n==4.5){
        const start="22/12/2025"
        const end="1/2/2026"
        return [start, end]
    }
    else if (1<=n && n<=4){
        const zero= Temporal.PlainDate.from("2025-11-24")
        let start=zero.add({ days: 7*(n-1) })
        let end=start.add({ days: 6 })
        start=start.toLocaleString("es-ES")
        end=end.toLocaleString("es-ES")
        return [start, end]
    }
    else{ //5<=n
        const zero= Temporal.PlainDate.from("2026-02-02")
        let start=zero.add({ days: 7*(n-5) })
        let end=start.add({ days: 6 })
        start=start.toLocaleString("es-ES")
        end=end.toLocaleString("es-ES")
        return [start, end]
    }
}
function weekreport(people,wk){
    let report= "🗿"+mathbb("WEEKLY point REPORT")+"🗿<br>"+
    mathbb("WEEK ") + wk + " (" + week(wk)[0] + " - "+week(wk)[1] + ")<br>"+
    mathbb("This week's points")

    for (let person of people){
        if (person.participatedwk(wk)){
        let points_in_wk = (person.points).get(wk)
        //report+="<br>"+mathbb(person.name)+": "+points_in_wk[0]+" - "+points_in_wk[1] + person.list_otherwk(wk)    
        report+="<br>"+mathbb(person.name)+": "+person.realwk(wk) + person.list_otherwk(wk)
        }
    }
    return report
}

function totalreport(people,wk){
    let report= "🗿"+mathbb("WEEKLY point REPORT")+"🗿<br>"+
    mathbb("WEEK ") + wk + " (" + week(wk)[0] + " - "+week(wk)[1] + ")<br>"+
    mathbb("Total points")

    for (let person of people){
        report+="<br>"+mathbb(person.name)+": "+person.realpoints(wk) + person.list_other(wk)  
    }
    return report
}

function gettxt(n){
    let txt=""
    for (let person of people){
        if (person.participatedwk(n)){
            let points_in_wk = (person.points).get(n)
            txt+="<br>" + person.name + "; " + points_in_wk[0] + "; "+points_in_wk[1] + "; " + person.list_otherwk(n);   
        }
    }
    return txt
}

function getnames(people){
    const names= []
    for (let person of people){
        names.push('"'+person.name+'"')
    }
    return names.join(',')
}

//#region WEEK 1

//new people
const Sebastian = new Person("Sebastián")
const Elyas = new Person("Elyas")
const Raquel = new Person("Raquel")
const Claudia = new Person ("Claudia")
const Laura = new Person("Laura")
const Tony= new Person("Ton&")
const Pepelu= new Person("Pepelu")
const Osiris = new Person("Osiris")
const Carmen = new Person("Carmen")
const Fabrizio = new Person("Fabrizio")
const Pepe = new Person("Pepe")
const Isabel = new Person ("Isabel")
const Pablo_RAE = new Person ("Pablo RAE")
const Girela = new Person("Girela")
const Juanmi = new Person("Juanmi")
const Raul = new Person("Raúl")
const Milana = new Person("Milana")
const Manolo = new Person("Manolo")
const Pablo_Sex = new Person("Pablo Sex")

//the points
Sebastian.points.set(1,[2,
                    0,
                    new Map([["-%",1],["🥚",2]])]);
Elyas.points.set(1,[11,
                    10,
                    new Map([["🐴",1],["🦐",1],[mathbb("47cm"),1]])]);
Raquel.points.set(1,[14,
                    9,
                    new Map([["0",1],["🥛",1]])]);
Claudia.points.set(1,[0,
                    21,
                    new Map()]);                    
Laura.points.set(1,[7,
                    4,
                    new Map([["🥛",3]])]);
Tony.points.set(1,[2,
                    1,
                    new Map([["✋",1]])]);
Pepelu.points.set(1,[5,
                    2,
                    new Map([["i",1],["🍽️",1],["🏎️",1]])]);
Osiris.points.set(1,[3,
                    2,
                    new Map([[mathbb("I thought the soup was milk for a second"),1]])])
Carmen.points.set(1,[5,
                    6,
                    new Map([["🍣",1]])]) 
Fabrizio.points.set(1,[7,
                    1,
                    new Map()])
Pepe.points.set(1,[2,
                    0,
                    new Map()])    
Isabel.points.set(1,[1,
                    4,
                    new Map()])                                                                            
Pablo_RAE.points.set(1,[6,
                    2,
                    new Map()])  
Girela.points.set(1,[9,
                    0,
                    new Map()])  
Juanmi.points.set(1,[0,
                    1,
                    new Map()])  
Raul.points.set(1,[6,
                    1,
                    new Map([["🌴",1],[mathbb("boing"),1],["Almost Christmas means it wasn't Christmas!",1]])])  
Milana.points.set(1,[1,
                    0,
                    new Map([["Almost Christmas means it wasn't Christmas!",1]])]) 
Manolo.points.set(1,[0,
                    1,
                    new Map()]) 
Pablo_Sex.points.set(1,[0,
                    1,
                    new Map()])   

//#endregion                    

//#region WEEK 2

//new people
const Kuba = new Person("Kuba")
const David = new Person("David")
const Bryam = new Person("Bryam")

//the points
Sebastian.points.set(2,[1,
                    4,
                    new Map()]);
Elyas.points.set(2,[14.1415927,
                    23,
                    new Map([["卍",1],["💇‍♀️",1],["Almost Christmas means it wasn't Christmas!",1]])]);
Raquel.points.set(2,[16,
                    3,
                    new Map()]);
Claudia.points.set(2,[4,
                    9,
                    new Map([["0",1]])]);                     
Laura.points.set(2,[12,
                    3,
                    new Map([["🔲",1]])]);
Tony.points.set(2,[0,
                    2,
                    new Map()]);
Pepelu.points.set(2,[1,
                    3,
                    new Map()]);
Osiris.points.set(2,[5,
                    7,
                    new Map([["😳",1]])])
Carmen.points.set(2,[7,
                    0,
                    new Map()]) 
Fabrizio.points.set(2,[7,
                    1,
                    new Map()]) 
Isabel.points.set(2,[2,
                    1,
                    new Map()])                                                                            
Pablo_RAE.points.set(2,[3,
                    2.5,
                    new Map([["🥏",1]])])  
Girela.points.set(2,[0,
                    1,
                    new Map()]) 
Raul.points.set(2,[5,
                    2,
                    new Map()])  
Manolo.points.set(2,[1,
                    1,
                    new Map()]) 
Pablo_Sex.points.set(2,[1,
                    2,
                    new Map([["💣",1],["🎷",1]])])    
Bryam.points.set(2,[1,
                    0,
                    new Map()])   
Kuba.points.set(2,[1,
                    0,
                    new Map([["ඞ",1],[":v",1]])]) 
David.points.set(2,[1,
                    2,
                    new Map()]) 

//#endregion

//#region WEEK 3  

//new people
const Chat = new Person("Chat")
const Imma = new Person("Imma")
const Jorge = new Person("Jorge")
const Dani = new Person("Dani")

//the points
Raquel.points.set(3,[17,
                    5,
                    new Map([["🔥",1]])]);
Elyas.points.set(3,[9.5,
                    3,
                    new Map([["🫧",1],["🎰",1],["🤨",1]])]);                
Sebastian.points.set(3,[4,
                    1,
                    new Map([[mathbb("boing"),1],["😳",1],["🎂",1]])]);
Isabel.points.set(3,[2.5,
                    3,
                    new Map([["👒",1],["🧀",1],["Almost Christmas means it wasn't Christmas!",1]])])                                                                            
Fabrizio.points.set(3,[6,
                    8,
                    new Map([["🪀",1],[mathbb("torus"),1]])]) 
Claudia.points.set(3,[1,
                    8,
                    new Map([["🫧",1],["🧑‍🍳",1]])]);                     
Laura.points.set(3,[13,
                    0,
                    new Map([[mathbb("bohemian point"),1],["🥛",1]])]);
Carmen.points.set(3,[8,
                    2,
                    new Map()]) 
Tony.points.set(3,[4,
                    0,
                    new Map([["🦖",1]])]);
Pablo_RAE.points.set(3,[5,
                    4,
                    new Map([["🎂",1],["😔",1]])])
Pepe.points.set(3,[3,
                    1,
                    new Map([["🎸",2],[mathbb("Ayuda Pepe"),1]])])                       
Raul.points.set(3,[5,
                    1,
                    new Map([["🎷",1],[mathbb("Paco"),1]])])  
Girela.points.set(3,[2,
                    2,
                    new Map([[":v",2]])]) 
Osiris.points.set(3,[1,
                    0,
                    new Map([["🤒",1],["🚬",1]])])
Dani.points.set(3,[2,
                    0,
                    new Map()]);
Pablo_Sex.points.set(3,[0,
                    2,
                    new Map()])    
Chat.points.set(3,[2,
                    1,
                    new Map([["🥛",1]])]);
Kuba.points.set(3,[0,
                    0,
                    new Map([["🫧",1]])]) 
Imma.points.set(3,[0,
                    0,
                    new Map([["🫧",1]])]) 
David.points.set(3,[0,
                    1,
                    new Map([["🔪",1]])]) 
Pepelu.points.set(3,[1,
                    1,
                    new Map()]);
Manolo.points.set(3,[1,
                    0,
                    new Map()]) 
Jorge.points.set(3,[1,
                    0,
                    new Map()])    
//#endregion

//#region WEEK 4  

//new people

//the points
Osiris.points.set(4,[0,
                    1,
                    new Map()])
Raquel.points.set(4,[16,
                    4,
                    new Map()]);
Claudia.points.set(4,[1,
                    8,
                    new Map([["0",1]])]);                     
Kuba.points.set(4,[0,
                    1,
                    new Map()]) 
Elyas.points.set(4,[9,
                    2,
                    new Map([["🔖",1],["🪵",1]])]);                
Pablo_RAE.points.set(4,[3,
                    0,
                    new Map([["📶",1]])])
Sebastian.points.set(4,[4,
                    1,
                    new Map([["📶",1]])]);
Isabel.points.set(4,[2,
                    1,
                    new Map()])                                                                            
Raul.points.set(4,[3,
                    1,
                    new Map()])  
Tony.points.set(4,[1,
                    0,
                    new Map([["📶",1],["🦕",1],[mathbb("ambiguous point"),1]])]);
Fabrizio.points.set(4,[1,
                    3,
                    new Map()]) 
Laura.points.set(4,[9,
                    1,
                    new Map()]);
Carmen.points.set(4,[7,
                    3,
                    new Map([[mathbb("apology point"),1]])]) 
Pablo_Sex.points.set(4,[0,
                    1,
                    new Map()])    
Girela.points.set(4,[0,
                    1,
                    new Map([["Miau",1],["🔘",1],["🧢",1]])]) 
Pepe.points.set(4,[1,
                    0,
                    new Map()])                       
Juanmi.points.set(4,[0,
                    0,
                    new Map([["Almost Christmas means it wasn't Christmas!",1]])]);
David.points.set(4,[1,
                    0,
                    new Map()])

//#endregion

//#region WEEK 4.5 (EXAMS)  

//new people
const Celina = new Person("Celina")
const Julia = new Person("Julia")

//the points
Raquel.points.set(4.5,[24.55,
                    4.2,
                    new Map([["🎾",1],["🍐",1],["🪈",1]])]);
Claudia.points.set(4.5,[3.5,
                    15.8,
                    new Map([["Almost Christmas means it wasn't Christmas!",1]])]);                     
Elyas.points.set(4.5,[7.5,
                    1,
                    new Map([["🍺",1]])]);                
Pablo_RAE.points.set(4.5,[3,
                    1,
                    new Map([["🏳️‍🌈",1],["🌴",1]])])
Sebastian.points.set(4.5,[2.5,
                    3,
                    new Map([["👨‍👦",1]])]);
Raul.points.set(4.5,[4,
                    1,
                    new Map([["😸",1]])])  
Laura.points.set(4.5,[6.5,
                    0,
                    new Map([["🥛",1],[mathbb("apology point"),1]])]);
Carmen.points.set(4.5,[11.4,
                    1,
                    new Map([["⚙️",1]])]) 
Dani.points.set(4.5,[1,
                    0,
                    new Map([["⚔️",1]])])
Tony.points.set(4.5,[1,
                    0,
                    new Map([["🦠",1]])]);
Kuba.points.set(4.5,[0,
                    0,
                    new Map([["😶",1]])]) 
Isabel.points.set(4.5,[2.5,
                    3,
                    new Map()])                                                                            
Fabrizio.points.set(4.5,[0.5,
                    2,
                    new Map()]) 
Celina.points.set(4.5,[1.5,
                    0,
                    new Map()]) 
Osiris.points.set(4.5,[5.5,
                    4,
                    new Map([["💃",1],["🫘",1]])])
Julia.points.set(4.5,[1,
                    0,
                    new Map()]) 
Pepelu.points.set(4.5,[0.5,
                    0,
                    new Map()]);
Pablo_Sex.points.set(4.5,[2.5,
                    0,
                    new Map()])    
Pepe.points.set(4.5,[2,
                    0,
                    new Map()])                       
David.points.set(4.5,[4,
                    0,
                    new Map()])
//#endregion                

//#region WEEK 5  

//new people

//the points
David.points.set(5,[1,
                    1,
                    new Map()])
Isabel.points.set(5,[4,
                    1,
                    new Map()])                                                                            
Laura.points.set(5,[9,
                    1,
                    new Map([["🥛",1]])]);
Carmen.points.set(5,[2,
                    2,
                    new Map()]) 
Pablo_RAE.points.set(5,[1,
                    0,
                    new Map([["🛝",1]])])
Raul.points.set(5,[6,
                    2,
                    new Map([["🦢",1]])])  
Dani.points.set(5,[1,
                    0,
                    new Map()])
Tony.points.set(5,[2,
                    1,
                    new Map([["🔄",1]])]);
Pepe.points.set(5,[1,
                    0,
                    new Map()])                       
Elyas.points.set(5,[2,
                    2,
                    new Map()]);                
Sebastian.points.set(5,[4,
                    1,
                    new Map()]);
Osiris.points.set(5,[1,
                    1,
                    new Map()])
Fabrizio.points.set(5,[0,
                    1,
                    new Map()]) 
Raquel.points.set(5,[14,
                    0,
                    new Map([[mathbb("point❓"),1]])]);
Claudia.points.set(5,[1,
                    11,
                    new Map([["👒",1]])]);                     
Chat.points.set(5,[2,
                    0,
                    new Map()]) 
Julia.points.set(5,[1,
                    0,
                    new Map()]) 
Pepelu.points.set(5,[1,
                    0,
                    new Map()]);
Pablo_Sex.points.set(5,[3,
                    0,
                    new Map()]);
Kuba.points.set(5,[0,
                    0,
                    new Map([[mathbb("sad point"),1]])]) 
Manolo.points.set(5,[0,
                    1,
                    new Map()])    
//#endregion 

//#region WEEK 6

//new people

//the points
Claudia.points.set(6,[14,
                    13,
                    new Map([["🌵",1],["💝",1]])]);                     
Raquel.points.set(6,[28,
                    3,
                    new Map([["🎺",1]])]);
Kuba.points.set(6,[5,
                    0,
                    new Map([["🌵",1]])]) 
Raul.points.set(6,[5,
                    0,
                    new Map([["🪮",1]])])  
Pablo_RAE.points.set(6,[37,
                    2,
                    new Map([["🗿",2],["💝",1]])])
Sebastian.points.set(6,[35,
                    1,
                    new Map([["🌴",1],[mathbb("memento mori"),1],["😳",1],["💝",1]])]);
Laura.points.set(6,[14,
                    0,
                    new Map([["🌵",1]])]);
Dani.points.set(6,[7,
                    0,
                    new Map([["💔",1]])])
Elyas.points.set(6,[7,
                    0,
                    new Map()]);                
Isabel.points.set(6,[27,
                    2,
                    new Map([["🗿",2],["🌵",1],["🐉",1],["💝",1]])])                                                                            
Carmen.points.set(6,[18,
                    1,
                    new Map([["😳",1]])]) 
Pepe.points.set(6,[7.3,
                    0,
                    new Map()])                       
David.points.set(6,[9,
                    2,
                    new Map()])
Chat.points.set(6,[2,
                    0,
                    new Map()]) 
Osiris.points.set(6,[2,
                    0,
                    new Map([[mathbb("sorry point"),1]])])
Tony.points.set(6,[6,
                    0,
                    new Map([["🔃",1]])]);
Manolo.points.set(6,[1,
                    1,
                    new Map()])    
Pablo_Sex.points.set(6,[4,
                    0,
                    new Map([["🌵",1]])]);
Milana.points.set(6,[3,
                    0,
                    new Map([["🌵",1]])]) 
Fabrizio.points.set(6,[1,
                    0,
                    new Map()]) 
Celina.points.set(6,[2,
                    0,
                    new Map()]);
//#endregion 

//#region WEEK 7

//new people

//the points
Elyas.points.set(7,[6,
                    9,
                    new Map([[":v",1],["🪳",1]])]);                
Raquel.points.set(7,[9,
                    3,
                    new Map()]);
Osiris.points.set(7,[1,
                    1,
                    new Map([["🇨🇳",1]])])
Pablo_RAE.points.set(7,[0,
                    1,
                    new Map()])
Isabel.points.set(7,[3,
                    0,
                    new Map()])                                                                            
Laura.points.set(7,[6,
                    2,
                    new Map([["〰️",1],["🍍",1]])]);
Claudia.points.set(7,[1,
                    6.1,
                    new Map([["🌞",1]])]);                     
Raul.points.set(7,[1,
                    0,
                    new Map([["✌️",1]])])  
Carmen.points.set(7,[0,
                    2,
                    new Map()]) 
David.points.set(7,[2,
                    0,
                    new Map()])
Kuba.points.set(7,[1,
                    0,
                    new Map()]) 
Dani.points.set(7,[0,
                    1,
                    new Map()])
Pablo_Sex.points.set(7,[2,
                    0,
                    new Map()]);
Sebastian.points.set(7,[3,
                    0,
                    new Map()]);
//#endregion 

//#region WEEK 8

//new people
const Alberto = new Person("Alberto")
const Pablo_black_cat = new Person("Pablo's black cat")
const Pablo_white_cat = new Person("Pablo's white cat")
const Pablo_dog = new Person("Pablo's dog")

//the points
Pablo_Sex.points.set(8,[6,
                    1,
                    new Map()]);
Isabel.points.set(8,[7,
                    0,
                    new Map()])                                                                            
Raul.points.set(8,[7,
                    1,
                    new Map([["🪂",1],["🌵",1],["⚽",1]])])  
Raquel.points.set(8,[12,
                    6,
                    new Map([["🇳🇬",1]])]);
Elyas.points.set(8,[6,
                    4,
                    new Map([[mathbb("calcio semidesnatado"),1]])]);                
Laura.points.set(8,[8,
                    2,
                    new Map()]);
Claudia.points.set(8,[5,
                    12,
                    new Map()]);                     
Osiris.points.set(8,[3,
                    1,
                    new Map()])
Carmen.points.set(8,[3,
                    0,
                    new Map()]) 
Manolo.points.set(8,[2,
                    0,
                    new Map()])    
Imma.points.set(8,[0,
                    0,
                    new Map([["⚗️",1]])]) 
Kuba.points.set(8,[1,
                    0,
                    new Map()]) 
Pablo_RAE.points.set(8,[2,
                    2,
                    new Map()])
Sebastian.points.set(8,[6,
                    0,
                    new Map()]);
Dani.points.set(8,[5,
                    0,
                    new Map()])
Pepe.points.set(8,[3,
                    0,
                    new Map([["🚗",1],["⚽",1]])])                       
David.points.set(8,[5,
                    4,
                    new Map([["⚽",1]])])
Chat.points.set(8,[1,
                    0,
                    new Map()]) 
Tony.points.set(8,[1,
                    0,
                    new Map()]);
Milana.points.set(8,[1,
                    0,
                    new Map()]) 
Fabrizio.points.set(8,[1,
                    0,
                    new Map()]) 
Celina.points.set(8,[1,
                    0,
                    new Map()]);
Alberto.points.set(8,[5,
                    2,
                    new Map([["🌳",1],["⏳",1]])]);
Pablo_black_cat.points.set(8,[1,
                    0,
                    new Map()]);
Pablo_white_cat.points.set(8,[1,
                    0,
                    new Map()]);
Pablo_dog.points.set(8,[0,
                    1,
                    new Map()]);
Pepelu.points.set(8,[1,
                    0,
                    new Map()]);
Julia.points.set(8,[0,
                    0,
                    new Map([["😲",1]])]);
//#endregion 

//#region WEEK 9

//new people
const Alejandro = new Person("Alejandro")

//the points
Manolo.points.set(9,[0,
                    1,
                    new Map()])    
Raquel.points.set(9,[14,
                    9,
                    new Map([["🇳🇱",1]])]);
Elyas.points.set(9,[3,
                    2,
                    new Map()]);                
Alberto.points.set(9,[2,
                    1,
                    new Map()]);
Claudia.points.set(9,[13,
                    10,
                    new Map()]);                     
Laura.points.set(9,[10,
                    2,
                    new Map([[mathbb("diadic point"),1]])]);
David.points.set(9,[4,
                    4,
                    new Map([["🌀",1]])])
Pepelu.points.set(9,[1,
                    0,
                    new Map()]);
Raul.points.set(9,[12,
                    2,
                    new Map([["🚜",1]])])  
Kuba.points.set(9,[0,
                    2,
                    new Map()]) 
Pablo_RAE.points.set(9,[6,
                    1,
                    new Map()])
Alejandro.points.set(9,[1,
                    2,
                    new Map()]);
Fabrizio.points.set(9,[0,
                    1,
                    new Map()]) 
Sebastian.points.set(9,[3,
                    0,
                    new Map()]);
Pablo_Sex.points.set(9,[1,
                    2,
                    new Map()]);
Osiris.points.set(9,[2,
                    0,
                    new Map()])
Pepe.points.set(9,[2,
                    0,
                    new Map()])                       
Tony.points.set(9,[1,
                    0,
                    new Map()]);
Carmen.points.set(9,[3,
                    0,
                    new Map()]) 
Chat.points.set(9,[3,
                    1,
                    new Map()]) 
Dani.points.set(9,[3,
                    0,
                    new Map()])
//#endregion 

//#region WEEK 10

//new people
const Elyas_mother = new Person("Elyas' mother")

//the points
Raul.points.set(10,[6,
                    3,
                    new Map([["❓",1]])])  
Isabel.points.set(10,[10,
                    1,
                    new Map([["🗣️",1]])])                                                                            
Raquel.points.set(10,[14,
                    26,
                    new Map([["🪵",1],["♻️",1]])]);
Laura.points.set(10,[17,
                    8,
                    new Map([["👉👈",1]])]);
Elyas.points.set(10,[25,
                    17,
                    new Map([[mathbb("weierstrass point"),1],["🧩",1]])]);                
Alberto.points.set(10,[20,
                    1,
                    new Map()]);
Osiris.points.set(10,[5,
                    5,
                    new Map([["🏵️",1]])])
Claudia.points.set(10,[7,
                    12,
                    new Map([["🪵",1]])]);                     
Sebastian.points.set(10,[9,
                    2,
                    new Map([["🗣️",1],["🧐",1]])]);
Fabrizio.points.set(10,[8,
                    5,
                    new Map()]) 
Tony.points.set(10,[4,
                    11,
                    new Map()]);
Pablo_RAE.points.set(10,[15,
                    6,
                    new Map([[mathbb("sillo"),1]])])
Pablo_Sex.points.set(10,[6,
                    14,
                    new Map([["🗣️",1],["🤨",1]])]);
Pepe.points.set(10,[5,
                    4,
                    new Map()])                       
David.points.set(10,[7,
                    3,
                    new Map()])
Elyas_mother.points.set(10,[1,
                    0,
                    new Map()]);
Chat.points.set(10,[1,
                    2,
                    new Map()]) 
Manolo.points.set(10,[2,
                    0,
                    new Map([["😶",1]])])    
Kuba.points.set(10,[1,
                    4,
                    new Map([["🗣️",1]])]) 
Juanmi.points.set(10,[0,
                    0,
                    new Map([["🔰",1]])]) 
Celina.points.set(10,[0,
                    4,
                    new Map()]);
Carmen.points.set(10,[1,
                    0,
                    new Map()]) 
Dani.points.set(10,[7,
                    1,
                    new Map()])
//#endregion 



//////////////////////////////////                    
const people=[Alberto,
Alejandro,
Bryam,
Carmen,
Celina,
Chat,
Claudia,
Dani,
David,
Elyas,
Elyas_mother,
Fabrizio,
Girela,
Imma,
Isabel,
Jorge,
Juanmi,
Julia,
Kuba,
Laura,
Manolo,
Milana,
Osiris,
Pablo_RAE,
Pablo_Sex,
Pablo_black_cat,
Pablo_white_cat,
Pablo_dog,
Pepe,
Pepelu,
Raquel,
Raul,
Sebastian,
Tony,
]

/*
let Pablo = new Person("Pablo"),
    Raul = new Person("Raúl"),
    Isabel = new Person("Isabel");

Isabel.points.set(1,[3,2,new Map([["❓",1],["😲",8]])]);
Isabel.points.set(2,[10,1,new Map([["❓",2]])]);
Raul.points.set(1,[0,12,new Map([["😲",2]])]);

const people= [Isabel, Raul]
*/
function setweek(){
    let n= Number(document.getElementById("wk").value)
    document.getElementById("this week").innerHTML = weekreport(people,n);
    document.getElementById("total").innerHTML = totalreport(people,n);
    //alert("Week: " + n)
}









