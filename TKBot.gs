function myFunction() {
  var DICTIONARY = {
    "AT6": "An toàn điện toán đám mây",
    "TM5": "Chứng thực điện tử",
    "TM6": "Phòng chống và điều tra tội phạm máy tính",
    "TM7": "An toàn Internet & TM điện tử",
    "AT5": "Quản trị an toàn hệ thống"
  }
  var today = new Date();
  var first = new Date(today.getFullYear(), 6, 29);
  var theDay = Math.round(((today - first) / (1000 * 60 * 60 * 24)) + .5, 0);
  Logger.log(theDay);
  var week_1 = theDay / 7;
  var week_mod = theDay % 7;
  var week_col;
  var week_row;
  var message;
  if (week_mod == 0 || week_mod == 6) {
    message = "Hôm nay là cuối tuần chịu khó tập thể dục đi";
  } else if (today.getFullYear() >= 2020) {
    message = "Hiện tại chưa có lịch học bạn nhé"
    message = message + "\n(" + randomEmojiChatwork() + ")"
    return send_message_for_today(message);
  } else {
    week_col = parseInt(week_1) + 1;
    week_row = week_mod;

    var real_col = week_col + 2;
    var real_row = ((week_row - 1) * 3 + 2);
    Logger.log(real_col + "/" + real_row);
    var file_tkb = GOOGLE_SHEET_ID;
    var ss = SpreadsheetApp.openById(file_tkb);
    var url = ss.getUrl();
    var a = ss.getSheets()[0].getSheetValues(real_row + 1, real_col, 1, 1);
    var study_code = a[0][0];
    if (study_code != "") {
      var study_name = DICTIONARY[study_code];
      if (study_name == undefined) {
        message = "Opps!!!\nLát nữa cậu phải học môn có mã là " + study_code + " từ 18h đến 21h đấy nhé!!";
        message = message + "\nVui lòng update lại từ điển để mình có thể biết được tên môn";
        message = message + "\nNếu mã môn trên là sai, hãy xem lại thời khóa biểu tại: " + url;
      } else {
        message = "Hê lô mai phen :))\nLát nữa cậu phải học môn " + study_name + " từ 18h đến 21h đấy nhé!!";
      }
    } else {
      message = "Hôm nay cậu được nghỉ đấy (tunghoa)";
    }
    if (week_mod == 3) {
      message = message + "\nHôm nay cũng là thứ 4, 21h đi đá bóng nhé";
    }
  }
  message = message + "\n(" + randomEmojiChatwork() + ")"
  send_message_for_today(message);
}

function send_message_for_today(textMessage) {
  send_to_telegram(textMessage);
  send_to_chatwork(textMessage);
  send_to_facebook(textMessage);
}

// Telegram
function send_to_telegram(textMessage) {
  var payload = {
    "method": "sendMessage",
    "chat_id": "891173656",
    "text": textMessage,
    "parse_mode": "HTML"
  }

  var data = {
    "method": "post",
    "payload": payload
  }
  var API_TOKEN = TELEGRAM_API_TOKEN;
  UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data);
  Logger.log("Send Telegram ok");
}

//Chatwork
function send_to_chatwork(textMessage) {
  var room_id = "170443428"
  var API_TOKEN = CHATWORK_API_TOKEN
  var basText = "[toall] Boss \n" + textMessage //private user [To:3797875]
  var headers = {
    "X-ChatWorkToken": API_TOKEN
  }
  var payload = {
    "body": basText
  }
  var options = {
    "method": "post",
    "headers": headers,
    "payload": payload,
    "muteHttpExceptions": true
  }
  UrlFetchApp.fetch("https://api.chatwork.com/v2/rooms/" + room_id + "/messages?force=0", options);
  Logger.log("Send Chatwork ok");
}

//Facebook
function send_to_facebook(textMessage) {
  var recipient_ids = [REPLICIENT_ID];
  var API_TOKEN = GRAPH_API_TOKEN
  for (var j = 0; j < recipient_ids.length; j++) {
    var messageData = {
      "recipient": {
        "id": recipient_ids[j]
      },
      "message": {
        "text": textMessage
      }
    }
    var JSONdMessageData = {}
    for (var i in messageData) {
      JSONdMessageData[i] = JSON.stringify(messageData[i])
    }
    var payload = JSONdMessageData
    //    payload.access_token = API_TOKEN
    var options = {
      "method": "post",
      "payload": payload
    }

    UrlFetchApp.fetch("https://graph.facebook.com/v5.0/me/messages?access_token=" + API_TOKEN, options);
  }
  Logger.log("Send Facebook ok");
}

function randomEmojiChatwork() {
  var BASE = [
    "bonjour", "best", "ok4", "dima2", "ahaha6", "nguamong", "ohh", "giatminh", "manhmelen2", "bantim2",
    "nguong3", "laplo", "suysup", "suysup2", "quaylen2", "ne2", "choangvang", "xihoi2", "muonsao", "khac",
    "liem2", "anui3", "chatbombom", "ohkinh", "deptrai2", "chetcuoi", "thahoa", "boiroi3", "thaptho",
    "no2", "dexemda", "suynghi3", "dead4", "khoctham", "didi", "lacbung", "hahaha2", "bitmieng", "danhnhau2",
    "xoadau", "ok5", "ohyeah2", "tranhra", "hmm2", "?3", "tunghoa2", "caigico2", "muongi", "chetcuoi2",
    "hahaha3", "ohkinh2", "dunghinh2", "nomah", "setdanh", "5ting", "drunk2", "tucgian2", "danhnhau3", "bantim3",
    "doiqua2", "sleep3", "devaoday", "thamthut", "roger3", "dangthuong", "xoabung2", "yza", "bye3", "laclu2",
    "caigico3", "tucgian3", "kiss", "cogihot", "khongchiudau4", "chandoi3", "namday", "votay"
  ]
  return BASE[Math.floor(Math.random() * BASE.length)];
}
