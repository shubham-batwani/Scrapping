/* Sir, Madam

    As per the contest Requirement I was suppose to perform Web scrapping on CollegeDunia Website, but due to error 
    of Server I was unablw to perform the same, so I as per My Knowledge I have tried to perform the same on

    "CollegeDekho Website"

    Hope you will consider my situation and consider me If found efficient as per your requirements

    Thanking You!!

*/


const url="https://www.collegedekho.com/btech-colleges-in-aligarh/";

const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const xlsx=require("xlsx");

const collegePath=path.join(__dirname,"college");
dirCreator(collegePath);

request(url,cb);

function cb(err,response,html){
        if(err)
        {
            console.log(err);
        }
        else
        {
            // console.log(html);
            extractLink(html);
        }
}

// div  .box .title

function extractLink(html)
{
    let $=cheerio.load(html);
    let collegeNameArray = $("div .box .title>a");
    for(let i=0;i<6;i++)
    {
        let link=$(collegeNameArray[i]).attr("href");
        let FullLink="https://www.collegedekho.com" + link;
        console.log(FullLink);

        getCollegeInfo(FullLink);
    }
}

function getCollegeInfo(url)
{
    request(url,function(err,response,html){
        if(err)
        {
            console.log(err);
        }
        else
        {
            // div .ReadMoreCommon p
            let $=cheerio.load(html);
            let College=$("div .overviewBlock h2");
            let info=$("div #div-content");

            let collegeName=$(College).text();
            

            let information=$(info).text();

            let CoursesArray=$(".block.couresFeeBlock .courseName .dto-get-btn");

            console.log(collegeName);
            console.log(information);

            let str="";
            // console.log(CoursesArray);

            for(let i=0;i<CoursesArray.length;i++)
            {
                str=str+" \n"+$(CoursesArray[i]).text();
                // console.log($(CoursesArray[i]).text());
            }

            console.log(str);

            let res = collegeName.substring(0, 25);

            processCollege(res,information,str);
        }
        
    })
}

function processCollege(collegeName,info,str)
{
    let filePath=path.join(collegePath,collegeName+".xlsx");
    let contents=excelreader(filePath,collegeName);
    let CollegeObj={
        collegeName,
        info,
        str
    }
    
    contents.push(CollegeObj);
    excelwriter(filePath,contents,collegeName);
}

function dirCreator(filePath){
    if(fs.existsSync(filePath)== false){
        fs.mkdirSync(filePath);
    }
}

function excelwriter(filePath,json,sheetName)
{
    let newWB=xlsx.utils.book_new();
    let newWS=xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWS,sheetName);
    xlsx.writeFile(newWB,filePath);
}

function excelreader(filePath,sheetName)
{
    if(fs.existsSync(filePath)==false){
        return [];
    }
    let wb=xlsx.readFile(filePath);
    let excelData=wb.Sheets[filePath];
    let ans= xlsx.utils.sheet_to_json(excelData);
    return ans;
}
