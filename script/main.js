function empty (name){
    return [name,0,0,[""]]
}

function isEmpty(points){
    return points[1]==0 && points[2]==0 && points[3][0]==""
}

//points string format-> name; pos; neg; n_1*other_1, ... , n_l*other_l
function pointReader(points){
    const points_split = points.split(";")
    const name = points_split[0].trim()
    const positive = Number(points_split[1])
    const negative = Number(points_split[2])
    const other = points_split[3].trim().split(", ")
    return [name, positive, negative, other]
}   

//the inverse of PointReader
function PointWriter(points){
    const [name, positive, negative, other] = points
    if (other[0]==""){
        return (positive-negative)
    }
    else{
    return positive + "; "+ negative + "; " + other.join(", ")
    }
}

//both points formatted as arrays [name, pos, neg, n_1*other_1, ... , n_l*other_l]
//names have to be the same
function pointSum(points1,points2){
    const name= points1[0]
    if (name==points2[0]){
        const positive = points1[1]+points2[1]
        const negative = points1[2]+points2[2]
        const other1 = Array.from(points1[3])
        let other2 = Array.from(points2[3])
        if(other1[0]==""){return [name, positive, negative, other2]}
        else if(other2[0]==""){return [name, positive, negative, other1]}
        else{
        let n = other1.length
        let cont1 = 0

        while (cont1<n) {
            let otherpoint1 = other1[cont1].split("*")
            let m=other2.length
            let sum = false
            let cont2 = 0
            while (cont2<m && !sum){
                let otherpoint2= other2[cont2].split("*")
                let name1= "name1"
                let name2= "name1"
                let i = -1
                let j = -2
                if (otherpoint1.length==1){
                    if (otherpoint2.length==1){
                        name1= otherpoint1[0]
                        name2= otherpoint2[0]
                        i = 1
                        j = 1
                    }
                    else{
                        name1= otherpoint1[0]
                        name2= otherpoint2[1]
                        i = 1
                        j = Number(otherpoint2[0])
                    }
                }
                else {
                   if (otherpoint2.length==1){
                        name1= otherpoint1[1]
                        name2= otherpoint2[0]
                        i = Number(otherpoint1[0])
                        j = 1
                    }
                    else{
                        name1= otherpoint1[1]
                        name2= otherpoint2[1]
                        i = Number(otherpoint1[0])
                        j = Number(otherpoint2[0])
                    } 
                }
            if (name1==name2){
               other1[cont1]=`${i+j}`+"*"+name1
               other2=other2.slice(0,cont2).concat(other2.slice(cont2+1))
               sum=true
            }
            else {
                cont2+=1
            }
            } 
            cont1+=1
        }
        const other = other1.concat(other2)   
        return [name, positive, negative, other]
        }
    }
    else{
        return "Error: added points belonging to different people"
    }
}

//formats points as real + other_1 + ... + other_n
function pointFormatter(points){
    const [name, positive, negative, other] = points
    if (other[0]==""){
        return (positive-negative)
    }
    else{
    return (positive-negative) + " + "+ other.join(" + ")
    }
}

//fontifies a string
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

function loadFile(filePath) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath);
    xmlhttp.send();
    
    return xmlhttp.responseText;
}

function loadWeeks(n){
    const weeks=[]
    for (let i=0; i<=week_current;i++){
        alert(i)
        let week_i=loadFile(`data/points/week${i}.txt`)
        weeks.push(pointsFromWeek(week_i))
    }
    return weeks
}

//gets points array from string
function pointsFromWeek(week){
    const week_split = week.split("\n")
    for (let i=0; i<week_split.length;i++){
        week_split[i]=pointReader(week_split[i])
    }
    return week_split
}
//points of person in week n.
function getPoints(weeks, person, n){
    weekpoints = weeks[n]
    for (let points of weekpoints){
       if (points[0] == person){
        return points
       }
    }
    return empty(person)
}

//total points of person in week n
function getPointsTotal(weeks,person, n){
    let points = empty(person)
    for (let i = 0; i <= n; i++){
        pointsweek_i=getPoints(weeks,person,i)
        points= pointSum(points,pointsweek_i)
    }
    return points
}

//returns week start and end from number
function week(n){
    if (n==4){
        const start="22/12/2025"
        const end="1/2/2026"
        return [start, end]
    }
    else if (0<=n && n<=3){
        const zero= Temporal.PlainDate.from("2025-11-24")
        let start=zero.add({ weeks: n })
        let end=start.add({ days: 6 })
        start=start.toLocaleString("es-ES")
        end=end.toLocaleString("es-ES")
        return [start, end]
    }
    else{ //5<=n
        const zero= Temporal.PlainDate.from("2026-02-02")
        let start=zero.add({ weeks: n-5 })
        let end=start.add({ days: 6 })
        start=start.toLocaleString("es-ES")
        end=end.toLocaleString("es-ES")
        return [start, end]
    }
}

//inverse of week
function weekNumber(date){
    const zero= Temporal.PlainDate.from("2025-11-24")
    const four= Temporal.PlainDate.from("2025-12-22")
    const five= Temporal.PlainDate.from("2026-02-02")
    if (Temporal.PlainDate.compare(date,four)==-1){
        return "Error: prehistoric date"
    } 
    else if(Temporal.PlainDate.compare(date,four)==-1){
        return date.since(zero,{smallestUnit : "weeks"}).total({unit:"weeks",relativeTo:zero})
    }
    else if(Temporal.PlainDate.compare(date,five)==-1){
        return 4
    }
    else {
        return date.since(zero,{smallestUnit : "weeks"}).total({unit:"weeks",relativeTo:zero})
    }
}

//report of week n's points
function weekReport(weeks,people,n){
    let report= "🗿"+mathbb("WEEKLY point REPORT")+"🗿<br>"+
    mathbb("WEEK ") + n + " (" + week(n)[0] + " - "+week(n)[1] + ")<br>"+
    mathbb("This week's points")

    for (let person of people){
        const points = getPoints(weeks,person,n)
        if (!isEmpty(points)){ 
        report+="<br>"+mathbb(person)+": "+pointFormatter(points)
        }
    }
    return report
}

//report of points up to week n
function totalReport(weeks,people,n){
    let report= "🗿"+mathbb("WEEKLY point REPORT")+"🗿<br>"+
    mathbb("WEEK ") + n + " (" //+ week(n)[0] + " - "+week(n)[1] + ")<br>"+
    mathbb("Total points")

    for (let person of people){
        //alert(person)
        const points = getPointsTotal(weeks,person,n)
        report+="<br>"+mathbb(person)+": "+pointFormatter(points)
    }
    return report
}
/*
//test variables
//let claupoints= "Claudia; 1; 15; ✋"
//let claupoints2="Claudia; 6; 1; 2*✋"
//const clau1= pointReader(claupoints)
//const clau2= pointReader(claupoints2)
let clau1= empty("Claudia")
let clau2= empty("Claudia")

const clausum = pointSum(clau1,clau2)
//document.getElementById("test").innerHTML = clau1+"<br>"+clau2+"<br>"+clausum+"<br>"+pointFormatter(clausum)
*/

//const people = ["Alberto","Alejandro","Bryam","Carmen","Celina","Chat","Claudia","Dani","David","Elyas","Elyas' mother","Fabrizio","Girela","Imma","Isabel","Jorge","Juanmi","Julia","Kuba","Laura","Manolo","Milana","Osiris","Pablo RAE","Pablo Sex","Pablo's black cat","Pablo's white cat","Pablo's dog","Pepe","Pepelu","Raquel","Raúl","Sebastián","Ton&"]
//const people = fetchTextWithFallback("people.txt").split("\n")
//const people = ["Carmen", "Claudia"]

const week00="Carmen; 5; 6; 🍣\nClaudia; 0; 21; \nElyas; 11; 10; 🐴, 🦐, 47𝕔𝕞\nFabrizio; 7; 1; \nGirela; 9; 0; \nIsabel; 1; 4; \nJuanmi; 0; 1; \nLaura; 7; 4; 3*🥛\nManolo; 0; 1; \nMilana; 1; 0; Almost Christmas means it wasn't Christmas!\nOsiris; 3; 2; 𝕀 𝕥𝕙𝕠𝕦𝕘𝕙𝕥 𝕥𝕙𝕖 𝕤𝕠𝕦𝕡 𝕨𝕒𝕤 𝕞𝕚𝕝𝕜 𝕗𝕠𝕣 𝕒 𝕤𝕖𝕔𝕠𝕟𝕕\nPablo RAE; 6; 2; \nPablo Sex; 0; 1; \nPepe; 2; 0; \nPepelu; 5; 2; i, 🍽️, 🏎️\nRaquel; 14; 9; 0, 🥛\nRaúl; 6; 1; 🌴, 𝕓𝕠𝕚𝕟𝕘, Almost Christmas means it wasn't Christmas!\nSebastián; 2; 0; -%, 2*🥚\nTon&; 2; 1; ✋"
const week01="Bryam; 1; 0; \nCarmen; 7; 0; \nClaudia; 4; 9; 0\nDavid; 1; 2;\nElyas; 14.1415927; 23; 卍, 💇‍♀️, Almost Christmas means it wasn't Christmas!\nFabrizio; 7; 1;\nGirela; 0; 1;\nIsabel; 2; 1;\nKuba; 1; 0; ඞ, :v\nLaura; 12; 3; 🔲\nManolo; 1; 1;\nOsiris; 5; 7; 😳\nPablo RAE; 3; 2.5; 🥏\nPablo Sex; 1; 2; 💣, 🎷\nPepelu; 1; 3;\nRaquel; 16; 3;\nRaúl; 5; 2;\nSebastián; 1; 4;\nTon&; 0; 2; "

const date_current = Temporal.Now.plainDateISO()
const week_current=weekNumber(date_current)
//const weeks = loadWeeks(week_current)
const people = loadFile("data/people.txt").split("\n")

function setweek(){
    let n= Number(document.getElementById("wk").value)
    document.getElementById("this week").innerHTML = loadFile("data/points/week0.txt");
    //document.getElementById("total").innerHTML = totalReport(weeks,people,n);
    //document.getElementById("total").innerHTML = clau1+"<br>"+clau2+"<br>"+clausum+"<br>"+pointFormatter(clausum)
}

