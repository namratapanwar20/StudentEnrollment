var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var DBName = "SCHOOL-DB";
var RelationName = "STUDENT-TABLE";
var connToken = "90931397|-31949321496231764|90950304";

$("#rollno").focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getEmpIdAsJsonObj(){
    var rollno = $("#rollno").val();
    var jsonStr = {
        rollno : rollno
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#fullname").val(record.fullname);
    $("#class").val(record.class);
    $("#bd").val(record.bd);
    $("#add").val(record.add);
    $("#ed").val(record.ed);
}

function resetForm(){
    $("#rollno").val("");
    $("#fullname").val("");
    $("#class").val("");
    $("#bd").val("");
    $("#add").val("");
    $("#ed").val("");
    $("#rollno").prop("disabled",false);
    $("#save").prop("disabled",true);
    $("#change").prop("disabled",true);
    $("#reset").prop("disabled",true);
    $("#rollno").focus();
}

function validateData(){
    var rollno, fullname, classvar, bd, add, ed;
    rollno = $("#rollno").val();
    fullname = $("#fullname").val();
    classvar = $("#class").val();
    bd = $("#bd").val();
    add = $("#add").val();
    ed = $("#ed").val();

    if(rollno === " "){
        alert("Roll No. missing");
        $("#rollno").focus();
        return " ";
    }
    if(fullname === " "){
        alert("Full Name missing");
        $("#fullname").focus();
        return " ";
    }
    if(classvar === " "){
        alert("Class missing");
        $("#class").focus();
        return " ";
    }
    if(bd === " "){
        alert("Birth Date missing");
        $("#bd").focus();
        return " ";
    }
    if(add === " "){
        alert("Address missing");
        $("#add").focus();
        return " ";
    }
    if(ed === " "){
        alert("Enrollment Date missing");
        $("#ed").focus();
        return " ";
    }

    var jsonStrObj = {
        rollno: rollno,
        name: fullname,
        class: classvar,
        birthdate: bd,
        address: add,
        enrollmentdate: ed
    };
    return JSON.stringify(jsonStrObj);
}

function getStudent(){
    var stuIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken,DBName,RelationName,stuIdJsonObj);
    jQuery.ajaxSetup({async : false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL,jpdbIRL);
    jQuery.ajaxSetup({async : true});
    if(resJsonObj.status === 400){
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#rollno").focus();
    }else if(resJsonObj.status === 200){
        $("#rollno").prop("disabled", true);
        fillData(resJsonObj);

        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullname").focus();
    }
}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj === ""){
        return '';
    }
    var putRequest = createPUTRequest(connToken,jsonStrObj, DBName, RelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#empid").focus();
}

function changeData(){
    $("#change").prop("disabled",true);
    jsonChg=validateData();
    var updateRequest = createUPDATERecordRequest(connToken,jsonChg,DBName,RelationName,localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    console.log(resJsonObj);
    resetForm();
    $("#rollno").focus();
}