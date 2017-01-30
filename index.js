var Nightmare = require('nightmare');       
var nightmare = Nightmare({ show: true });
var Promise = require('promise');
var fs = require("fs");

var nextPage = '';
var bIC = 'http://www.builtincolorado.com/jobs#/jobs?f%5B%5D=im_job_categories%3A78&f%5B%5D=sm_field_job_city%3AGreater+Denver+Area' 
var jobs = [];

var sBiC = function(boo) {
    if(!fs.existsSync('list.txt')){
        console.log("running for the 1st time");
        nightmare
    .goto(boo)
    .wait(3000)
    .evaluate(function () {
        var asd = [];
        var list = document.querySelectorAll('.views-field-nothing');
        list.forEach(function(e){
            asd.push(e.innerText.split('\n'));
        })
        nextPage = document.querySelector('.pager-next > a').href;
        return [asd, nextPage];
        
    })
    .then(function (result) {
        result[0].splice(0, 3);
        jobs.push(result[0]);
        nextPage = result[1];
        nightmare
            .goto(nextPage)
            .wait(3000)
            .evaluate(function () {
                var asd = [];
                var list = document.querySelectorAll('.views-field-nothing');
                list.forEach(function(e){
                    asd.push(e.innerText.split('\n'));
                })
                nextPage = document.querySelector('.pager-next > a').href;
                return [asd, nextPage];
                
            })
            .end()
            .then(function (result) {
                result[0].splice(0, 3);
                jobs.push(result[0]);

                require("fs").writeFile(
                    'list.txt',
                    jobs[0].map( item => item + '\n') + ' --- ' + '\n' +
                    jobs[1].map( item => item + '\n'),
                    function (err) { console.log(err ? 'Error :'+err : 'ok') }
                );
                console.log("done");

            })
        })
    .catch(function (error) {
        console.error('Search failed:', error);
    });
        
        return "run againe pls"
    }
    fs.createReadStream('list.txt').pipe(fs.createWriteStream('oldList.txt'));
    nightmare
    .goto(boo)
    .wait(3000)
    .evaluate(function () {
        var asd = [];
        var list = document.querySelectorAll('.views-field-nothing');
        list.forEach(function(e){
            asd.push(e.innerText.split('\n'));
        })
        nextPage = document.querySelector('.pager-next > a').href;
        return [asd, nextPage];
        
    })
    .then(function (result) {
        result[0].splice(0, 3);
        jobs.push(result[0]);
        nextPage = result[1];
        nightmare
            .goto(nextPage)
            .wait(3000)
            .evaluate(function () {
                var asd = [];
                var list = document.querySelectorAll('.views-field-nothing');
                list.forEach(function(e){
                    asd.push(e.innerText.split('\n'));
                })
                nextPage = document.querySelector('.pager-next > a').href;
                return [asd, nextPage];
                
            })
            .end()
            .then(function (result) {
                result[0].splice(0, 3);
                jobs.push(result[0]);

                require("fs").writeFile(
                    'list.txt',
                    jobs[0].map( item => item + '\n') + ' --- ' + '\n' +
                    jobs[1].map( item => item + '\n'),
                    function (err) { console.log(err ? 'Error :'+err : 'ok') }
                );
                console.log("done");

            })
            .then( foo => boogo())
        })
    .catch(function (error) {
        console.error('Search failed:', error);
    });
}
// returns 1st and second page of results as [ [ ['job title', 'company', ''] ]  ]
// first 3 are Featured + 20 recently posted
sBiC(bIC);

// [ [ [ 'QE Engineer', 'Layer3 TV', '' ],
//     [ 'IoT Full-Stack DeveloperNEW', 'HomeAdvisor', '' ],
//     [ 'Software Engineering ManagerNEW', 'HomeAdvisor', '' ]
//   ],
//   [ [ 'DevOps Engineer', 'Healthgrades', '' ],
//     [ 'Web Developer', 'Convercent', '' ],
//     [ 'Applications Engineer', 'Arrow Electronics, Inc.', '' ],
//   ]
// ]
var boogo = function(){
    var oldL = [];
    var newL = [];
    var newJ = 0;
    require("fs").readFile('list.txt', 'utf8', function(err, gege){
        newL = gege.split('\n');

        require("fs").readFile('oldList.txt', 'utf8', function(err, gege){
        oldL = gege.split('\n');
        var oldLL = ',' + oldL[0];
        console.log('Numbe of new postings: ', newJJ(oldLL, newL, 0))
          });
    });
}

var newJJ = function(oldList, newList, numberOfNew){
    if(numberOfNew === 0){
        if(oldList === ',' + newList[numberOfNew]){
            return "no new postings";
        }
    }
    if(newList.length + 1 === numberOfNew){
        return "non of the posting are the same... Maybe run it againe?"
    }
    if(newList[numberOfNew] === oldList){
        return numberOfNew;
    } else {
        numberOfNew += 1;
        return newJJ(oldList, newList, numberOfNew);
    }
}
