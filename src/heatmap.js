'use strict';

function night(isNight) {
    if (isNight) {
        document.body.style.backgroundColor = "#34383b";
    } else {
        document.body.style.backgroundColor = "#FFFFFF";
    }
}

function getDiffBetweenDay(firstDay, lastDay) {
    return Math.round((firstDay - lastDay) / (1000 * 60 * 60 * 24));
}

function getDayOffset(day, offsetDay) {
    var dayOffset = new Date(day.getTime());
    dayOffset.setDate(day.getDate() + offsetDay);
    return dayOffset;
}

function getYYYYMMDD(date) {
    Date.prototype.yyyymmdd = function () {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();

        return [this.getFullYear(),
            (mm > 9 ? '' : '0') + mm,
            (dd > 9 ? '' : '0') + dd
        ].join('');
    };
    return date.yyyymmdd();
}

function getDayObject(dayNum) {
    var f_y = dayNum.toString().substr(0, 4),
        f_m = dayNum.toString().substr(4, 2),
        f_d = dayNum.toString().substr(6, 2);
    return new Date(f_y, f_m - 1, f_d);
}

function init(data) {
    var dataObj = JSON.parse(data);
    // 先获取需要绘制的范围
    var firstDayItem = dataObj[0];
    var lastDayItem = dataObj[dataObj.length - 1];
    var firstDate = new Date(0);
    firstDate.setUTCSeconds(firstDayItem.epoch);

    var lastDate = new Date(0);
    lastDate.setUTCSeconds(lastDayItem.epoch);

    var firstYear = firstDate.getFullYear();
    var lastYear = lastDate.getFullYear();
    var yearOffset = lastYear - firstYear;

    // 将得到的数据做成Map
    var dataListMap = {};
    for (var i = 0; i < dataObj.length; i++) {
        var dataItem = dataObj[i];
        var thisDate = new Date(0);
        thisDate.setUTCSeconds(dataItem.epoch);
        dataListMap[getYYYYMMDD(thisDate)] = dataItem.count;
    }

    var firstYearItem = new Date(0);
    firstYearItem.setUTCFullYear(firstYear);
    firstYearItem = getDayOffset(firstYearItem, -1);

    var lastYearItem = new Date(0);
    lastYearItem.setUTCFullYear(lastYear + 1); //这里+1是为了保证拿到一整年
    lastYearItem = getDayOffset(lastYearItem, -1);

    var example_data1 = d3.timeDays(firstYearItem, lastYearItem).map(function (dateElement, index) {
        console.log(getYYYYMMDD(dateElement) + " index = " + JSON.stringify(index));
        var yyyymmddDate = getYYYYMMDD(dateElement);
        var value = 0;
        if (dataListMap[yyyymmddDate] !== undefined) {
            value = dataListMap[yyyymmddDate];
        }
        dateElement = getDayOffset(dateElement, 365);
        return {
            date: dateElement,
            details: [{
                value: value
            }],
            total: value
        };
    });


    // Set the div target id
    var div_id = 'calendar';
    // Set custom color for the calendar heatmap
    var color = '#1191e6';
    // Set overview type (choices are year, month and day)
    var overview = 'year';
    // Handler function
    // Initialize calendar heatmap
    calendarHeatmap.init(example_data1, div_id, color, overview);
}

function loadFinished() {
    var monthItemList = document.getElementsByClassName('label-month');
    var dateObj = new Date();

    var monthItem = monthItemList[dateObj.getMonth()];
    var scrollOffsetX = monthItem.getBBox().x;
    //稍微移出去一点
    if (scrollOffsetX > 10) {
        scrollOffsetX -= 10;
    }
    window.scrollTo(scrollOffsetX, 0);
}

function getClientHeight() {
    var containers = document.getElementsByClassName("calendar-heatmap");
    var calMap = containers[0];
    var s = window.getComputedStyle(calMap).height;
    return parseFloat(s.replace("px", ""));
}