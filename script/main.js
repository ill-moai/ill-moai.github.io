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

function howManyOther(points){
    const oth=points[3]
    let i=0
    for (let point of oth){
        const point_split= point.split("*")
        if (point_split.length==1){
            i+=1
        }
        else{
            i+=point_split[0]
        }
    }
    return i
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

async function loadFile(path) {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
 
    const text = await response.text()
    return text
}


async function loadWeeksPeople(n){
    if (ready){
        return null
    }
    else{
        let j=-1
        let ar=[]
        people = (await loadFile("data/people.txt").catch(() => "")).trimEnd().split("\n")
        for (let i=0; i<=week_current;i++){
            let week_i=(await loadFile(`data/points/week${i}.txt`).catch((error) => "")).trimEnd()
            //alert(week_i)
            if(week_i){
                ar.push(pointsFromWeek(week_i))
                j+=1
            }
        }
        weeks=Array.from(ar)
        last_update=j
        ready = true
        return null
    }
}

//gets points array from string
function pointsFromWeek(week){
    const week_split = week.split("\n")
    for (let i=0; i<week_split.length;i++){
        //alert(week_split[i])
        week_split[i]=pointReader(week_split[i])
    }
    return week_split
}
//points of person in week n.
function getPoints(weeks, person, n){
    if (weeks[n]){
    let weekpoints = weeks[n]
    for (let points of weekpoints){
       if (points[0] == person){
        return points
       }
    }}
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
    if (Temporal.PlainDate.compare(date,zero)==-1){
        return "Error: prehistoric date"
    } 
    else if(Temporal.PlainDate.compare(date,four)==-1){
        return date.since(zero,{smallestUnit : "weeks"}).total({unit:"weeks",relativeTo:zero})
    }
    else if(Temporal.PlainDate.compare(date,five)==-1){
        return 4
    }
    else {
        return date.since(five,{smallestUnit : "weeks"}).total({unit:"weeks",relativeTo:five})+5
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
    mathbb("WEEK ") + n + " (" + week(n)[0] + " - "+week(n)[1] + ")<br>"+
    mathbb("Total points")

    for (let person of people){
        //alert(person)
        const points = getPointsTotal(weeks,person,n)
        report+="<br>"+mathbb(person)+": "+pointFormatter(points)
    }
    return report
}

function listCurrentPoints(weeks,people,n){
    let text= []

    for (let person of people){
        const points = getPointsTotal(weeks,person,n)
        text.push(person+": "+pointFormatter(points))
    }
    return text.join("<br><br>")
}

function clickMoai(){
    if (document.getElementById("moai").src=="media/moai-green.png"){
        document.getElementById("moai").src="media/moai-purple.png"
    }
}

async function peopleDropdown(){
    if (document.getElementById("people dropdown").innerHTML){
        document.getElementById("people dropdown").innerHTML=""
        document.getElementById("people dropdown").classList.remove("show")
    }
    else{await loadWeeksPeople()
    let drop=[]
    for (let i=0; i< people.length ;i++){
        drop.push(`<div onclick="formPointButton(people[${i}],week_current)">${people[i]}</div>`)
    }
    document.getElementById("people dropdown").innerHTML=drop.join("<br>")
    document.getElementById("people dropdown").classList.toggle("show")
    }
    }

async function formPointButton(person,n){
    await loadWeeksPeople()
    const pointsArray=getPointsTotal(weeks,person,n)
    document.getElementById("form check button").innerHTML=`${person}`
    document.getElementById("someone's points").innerHTML="You have "+pointFormatter(pointsArray)+" points"
    if (canAffordSticker(pointsArray)){
        document.getElementById("sticker true or false").innerHTML="You can afford a sticker🥳"
        document.getElementById("sticker true or false").style="color:chartreuse"
    }
    else{
        document.getElementById("sticker true or false").innerHTML="You can't afford a sticker🫵😂"
        document.getElementById("sticker true or false").style="color:red"
    }
    document.getElementById("people dropdown").innerHTML=""
    document.getElementById("people dropdown").classList.remove("show")
}    

function canAffordSticker(points){
    return points[1]-points[2]>=10 || howManyOther(points)>=2
}


const date_current = Temporal.Now.plainDateISO()
const week_current=weekNumber(date_current)
let weeks = []
let last_update = -1
let people=[]
let ready = false

async function footerText(){
    await loadWeeksPeople(week_current)
    const text = "Current week: "+ week_current+" | Last updated: "+week(last_update)[1]+" (Week "+last_update+" )"
    document.getElementById("footer weeks").innerHTML = text
}

async function setweek(){
    await loadWeeksPeople(week_current)
    let n= Number(document.getElementById("wk").value)
    document.getElementById("this week").innerHTML = weekReport(weeks,people,n);
    document.getElementById("total").innerHTML = totalReport(weeks,people,n);
}

async function displayCurrentPoints(){
    await loadWeeksPeople(week_current)
    let n=week_current
    document.getElementById("points list").innerHTML = listCurrentPoints(weeks,people,n)
}

if(document.getElementById("points list")){
displayCurrentPoints()}

if(document.getElementById("footer weeks")){
    footerText()
}

