const DAYOFWEEK = ["日", "月", "火", "水", "木", "金", "土"];
const today = new Date();
var showDate = new Date(today.getFullYear(), today.getMonth(), 1);
var selected;
var parent = document.getElementById("calendar");
var cal;

// 祝日取得
var request;
window.onload = function () {
    request = new XMLHttpRequest();
    request.open("get", "https://holidays-jp.github.io/api/v1/date.csv", true);
    request.send(null);
    request.onload = function () {
        // 初期表示
        showProcess(today, calendar);
    };
};


/* ボタン */
// 前月
function prev(){
    showDate.setMonth(showDate.getMonth() - 1);
    showProcess(showDate);
}
// 今月
function now() {
    showDate = new Date(today.getFullYear(), today.getMonth(), 1);
    showProcess(showDate);
}
// 次月
function next(){
    showDate.setMonth(showDate.getMonth() + 1);
    showProcess(showDate);
}

/* カレンダー表示 */
function showProcess(date) {
    var year = date.getFullYear();
    var month = date.getMonth();
    document.querySelector("#header").innerHTML = year + "/" + (month + 1).toString().padStart(2, "0");
    
    
    if (parent.firstChild) {
        parent.removeChild(cal);
    }
    
    cal = createProcess(year, month);
    parent.appendChild(cal);
    
}

// カレンダー作成
function createProcess(year, month) {
    var day = 0;
    const startDayOfWeek = new Date(year, month, 1).getDay();
    const endDate = new Date(year, month + 1, 0).getDate();
    
    var datelist = new Array(6);
    for(let i = 0; i < 6; i++) {
        datelist[i] = new Array(7).fill(-1);
    }

    // 日付リスト
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 7; j++) {
            if (i == 0 && j < startDayOfWeek) {
                ;
            } else if (day >= endDate) {
                day++;
                datelist[i][j] = -1;
            } else {
                day++;
                datelist[i][j] = day;
            }
        }
    }
    
    // 曜日
    let table = document.createElement("table");
    let tr = document.createElement("tr");
    for (var i = 0; i < 7; i++) {
        let td = document.createElement("td");
        td.textContent = DAYOFWEEK[i];
        td.style.cssText = "font-weight: bold";
        td.onclick = function() {
            clickDoF(td.textContent);
        }
        tr.appendChild(td);
    }
    table.appendChild(tr);

    // 日付
    for (var i = 0; i < 6; i++) {
        let tr = document.createElement("tr");
        for (var j = 0; j < 7; j++) {
            let td = document.createElement("td");
            // 文字 
            td.textContent = (datelist[i][j] < 0) ? "x" : datelist[i][j];
            td.style.cssText = "font-weight: bold";
            // クラス・動作 
            if (datelist[i][j] < 0) {
                td.className = "disabled";
            } else {
                if (isToday(year, month, datelist[i][j])) {
                    td.className = "today";
                } else if (isHoliday(year, month, datelist[i][j])) {
                    td.className = "holiday";
                }
                td.onclick = function() {
                    if (selected != null)
                        selected.style.backgroundColor = this.style.backgroundColor;
                    selected = this;
                    td.style.backgroundColor = "orange";
                    document.getElementById("date").textContent = ((month+1).toString().padStart(2, "0")+"/"+this.textContent.padStart(2, "0"));
                    var namestr = datename[(month+1).toString().padStart(2, "0")+this.textContent.padStart(2, "0")];
                    if (namestr == "") {
                        document.getElementById("dayname").textContent = "";
                    }
                    else {
                        var namelist = namestr.split(",");
                        document.getElementById("dayname").textContent = namelist[Math.floor(Math.random() * namelist.length)];
                    }
                }
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
}

// 判定:今日
function isToday(year, month, day) {
    return (year == today.getFullYear()
        && month == (today.getMonth())
        && day == today.getDate());
}

// 判定:祝日
function isHoliday(year, month, day) {
    var checkDate = year + "-" + (month + 1).toString().padStart(2, "0") + "-" + day.toString().padStart(2, "0");
    var dateList = request.responseText.split("\n");
    for (var i = 1; i < dateList.length; i++) {
        if (dateList[i].split(",")[0] === checkDate) {
            return true;
        }
    }
    return false;
}


function clickDoF(dof) {
    const body = document.querySelector("body");
    body.classList.remove(...body.classList);
    if  (dof == "月") {
        
        body.classList.add("dark");
    }
    /*
    else if (dof == "火") {
        
        body.classList.add("fire");
    }
    else if (dof == "水") {
        
        body.classList.add("water");
    }
    else if (dof == "木") {
        
        body.classList.add("tree");
    }
    else if (dof == "金") {
        
        body.classList.add("gold");
    }
    else if (dof == "土") {
        
        body.classList.add("soil");
    }
    */
}
