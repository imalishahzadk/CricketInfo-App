import express from "express";
import request from "request";
const app = express()

app.set("views", "./views");
app.set("view engine", "pug");

app.get('/', (req, res)=>{
    res.redirect("home");
})

let currentMatches = []

app.get('/home', (req, res)=>{
    let url = "https://api.cricapi.com/v1/currentMatches?apikey=d5b4017d-5d55-4b1d-90b1-2e12ea77f6f6";
    request(url, { json: true }, (err, response, data) => {
        if (err) { return console.log(err); }
        currentMatches = []
        for(let d of data.data){
            if(d.score.length==2){
                currentMatches.push({
                    name: d.name,
                    type: d.matchType,
                    status: d.status,
                    venue: d.venue,
                    date: d.date,
                    t1runs: d.score[0].r,
                    t1wickets: d.score[0].w,
                    t1overs: d.score[0].o,
                    t1inning: d.score[0].inning,
                    t2runs: d.score[1].r,
                    t2wickets: d.score[1].w,
                    t2overs: d.score[1].o,
                    t2inning: d.score[1].inning,
                })
            }
        }
        res.render("home",{
            matches: currentMatches
        });
    });
})

app.get('/scoreboard', (req, res)=>{
    res.render("scoreboard",{
        matches: currentMatches
    });
})

app.get('/series', (req, res)=>{
    let url = "https://api.cricapi.com/v1/series?apikey=d5b4017d-5d55-4b1d-90b1-2e12ea77f6f6";
    request(url, { json: true }, (err, response, data) => {
        if (err) { return console.log(err); }
        let seriesList = []
        for(let d of data.data){
            seriesList.push({
                name: d.name,
                sdate: d.startDate,
                edate: d.endDate,
                odi: d.odi,
                t20: d.t20,
                test: d.test,
            })
        }
        res.render("series",{
            seriesList: seriesList
        });
    });
})

app.get('/teams', (req, res)=>{
    res.render("teams")
})

app.get('/player-search', (req, res)=>{
    let name = req.query.name;
    let url = "https://api.cricapi.com/v1/players?apikey=d5b4017d-5d55-4b1d-90b1-2e12ea77f6f6"+"&search="+name;
    request(url, { json: true }, (err, response, data) => {
        if (err) { return console.log(err); }
        if(data.data.length==0){
            res.render("notfound")
        }
        else{
            let pid = data.data[0].id
            let url = "https://api.cricapi.com/v1/players_info?apikey=d5b4017d-5d55-4b1d-90b1-2e12ea77f6f6"+"&id="+pid;
            request(url, { json: true }, (err, response, data) => {
                if (err) { return console.log(err); }
                if(data.data.length==0){
                    res.render("notfound")
                }
                else{
                    res.render("player",{
                        name: data.data.name,
                        dob: data.data.dateOfBirth.replace('T00:00:00',''),
                        role: data.data.role,
                        bat: data.data.battingStyle,
                        bowl: data.data.bowlingStyle,
                        pob: data.data.placeOfBirth,
                        country: data.data.country,
                    });
                }
            });
        }
    });
})

app.listen(8080, ()=>{
    console.log("Server Started...");
})