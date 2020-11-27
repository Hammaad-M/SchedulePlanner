

let numJobs = 1;
let jobs = [];
let jobtimes = [];
jobadder = document.getElementById('jobadder');
jobdeletor = document.getElementById('jobdeletor');
timefield = document.getElementById('timefield');
let taskbreaks = false;
let offclick = false;
let jobSets = 0;
let numBreaks = 0;
let idealJobSets = 0;
let outlier = 0;
let jobGroups = [];

function toggleTaskBreaks() {
    if (offclick != true) {
        if ((document.getElementById('jobCheckBox').value) == 'on') {
            taskbreaks = true;
            offclick = true;
        }
    }
    else {
        taskbreaks = false;
        offclick = false;
    }
    //console.log('taskbreaks: ' + taskbreaks)
    ////console.log('toggle returns ' + (document.getElementById('jobCheckBox').value));
    ////console.log('offclick status : ' + offclick)
}

function getJobs() {
    jobs = [];
    for (let i = 1; i <= numJobs; i++) {
        jobs.push(document.getElementById('job' + i + 'name').value);
    }
    return jobs;
}
function getJobtimes() {
    jobtimes = [];
    for (let i = 1; i <= numJobs; i++) {
        //console.log("ADDING: " + document.getElementById('job' + i + 'time').value);
        jobtimes.push(document.getElementById('job' + i + 'time').value);
    }
    return jobtimes; 
}

if (jobadder) {
    $('#jobadder').click(function() {
        numJobs+=1;
        //console.log('adding job');

        $('#jobadder').before(
            $('<div/>').attr ({
                'id' : 'job' + numJobs,
                'class' : 'jobdivs'
            })
        )
        $('#job' + numJobs).append(
            $('<input/>').attr ({
                type : 'text',
                'class' : 'jobnames',
                id : 'job' + numJobs + 'name',
                placeholder : 'Job Name'
            })
        )
        $('#job' + numJobs).append(  
            $('<input/>').attr ({   
                type : 'text',
                'class' : 'jobnames',
                id : 'job' + numJobs + 'time',
                placeholder : 'Time Required'
            })
        )
        $('#job' + numJobs).append(  
            $('<img/>').attr ({   
                src : 'x-icon.png',
                'class' : 'job_deletor',
                id : 'job' + numJobs + 'deletor'
            })
        )
        let deletedElement = document.getElementById("job" + numJobs + "deletor");
        let deletedElementId = "job" + numJobs;
        deletedElement.addEventListener("click", function () {
            removeJob(deletedElementId);
        });
        
    });
} 

function removeJob(deletedElementId) {
    //console.log("deleting element: " + deletedElementId);
    $('#'+deletedElementId).remove();
    numJobs--;
}

function getOutliers(test, jobSets) {
    //console.log("FUNCTION RETURN: " + test);
    //console.log("STRING FUNCTIOM RETURN: " + JSON.stringify(test));
    //console.log(test.length);
    //console.log(test);
    testStr = JSON.stringify(test);
    outlierReturn = 0;
    
    if (testStr.indexOf("<") == -1) { // Checks if no outliers exist
        idealJobSets = jobSets;
        //console.log('perfect match found.')
        return 0;
    } else { // Gets the outlier from the test string. 
        outlierReturnStr = testStr.substring(testStr.indexOf("<") + 1, testStr.indexOf(">"));
        //console.log(outlierReturnStr);
        if (outlierReturnStr.indexOf(",") == -1) {
            //console.log("outlier is a single number");
            outlierReturn = parseInt(outlierReturnStr);
        } else {
            outlierReturnArr = [];
            outlierReturnArr = outlierReturnStr.split(",");
            //console.log("outlier array return: " + outlierReturnArr);
            for (let i = 0; i<outlierReturnArr.length; i++) {
                outlierReturn += parseInt(outlierReturnArr[i]); 
            }
        }
        if (outlierReturn == jobSets) {
            outlierReturn = 0;
        }
        
    }
    //Grabs any outliers put into subsets
    for (let i = 0; i < test.length-1; i ++) {
        if (test[i].length > 1) {
            //console.log("many misplaced outliers");
            x = [];
            x = test[i]
            a = 0;
            for (let i = 0; i < x.length; i++) {
                a += x[i];
            }
            if (a != jobSets) {
                outlierReturn += a;
            }
            //console.log("current subArray: " + x + " current sum: " + a);
            //console.log("outlierReturn = " + outlierReturn);
        } else {
            if (parseInt(test[i]) != jobSets) {
                outlierReturn += parseInt(test[i]);
            }
        }
    }
    //console.log("LEAVING FUNCTION");
    return outlierReturn;
}
function getIdealJobSum(totalJobTime, jobtimes, minBreaks, maxBreaks) {
    let totalOutliers = 0;
    let lastOutlier = 10^10000; 
    //console.log("varsSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS : " + jobtimes[jobtimes.length-1]);
    for (jobSets = jobtimes[jobtimes.length-1]; jobSets < totalJobTime; jobSets++) {
        //console.log("new run NUMBER " + jobSets + "_______________________________________________________________");
        outlier = 0;
        test =  [];
        outlierReturnStr = "";
        outlierReturn = 0;
        test = createSubsets(jobtimes, jobSets);
        outlier = getOutliers(test, jobSets);
        //console.log('function return ' + test);
        //console.log("outlier: " + outlierReturn);
        //console.log('jobsets ' + jobSets);
        //console.log('outlier : ' + outlier);

        if (outlier <lastOutlier) {
            //console.log("totalJobtime: " + totalJobTime + " jobsets: " + jobSets + " result: " + (totalJobTime/jobSets) -1);
            //console.log("totalJobtime: " + totalJobTime);
            //console.log("jobsets: " + jobSets);
            let a = (totalJobTime/jobSets) -1;
            //console.log(" result: " + a);
            if ((totalJobTime/jobSets) -1 >= minBreaks && (totalJobTime/jobSets) -1 <= maxBreaks ) {
                //console.log("11111111111111111111111111");
                //console.log('updating ideal jobSets');
                idealJobSets = jobSets;
                //console.log('current ideal jobset : ' + idealJobSets);
                lastOutlier = outlier;
            }
        }
        //console.log('totalOutliers : ' + outlier + ' lastOutlier: ' + lastOutlier);

        
    }
    //console.log("idealjobset " + idealJobSets);
    return idealJobSets;
}

function getIdealBreakTime(jobSets, totalJobTime, totalBreakTime) {
    numBreaks = totalJobTime/jobSets;
    //console.log('numBreaks ' + numBreaks);
    breaktime = Math.floor(totalBreakTime/numBreaks);
    //console.log('breaktime ' + totalBreakTime);
    return breaktime;
}
function createSubsets(numbers, target) {
    //filter out all items larger than target
    numbers = numbers.filter(function (value) {       //REMOVED FOR OUTLIER ERRORS 
        return value <= target;
    });
    
    // sort from largest to smallest
    numbers.sort(function (a, b) {
        return b - a;
    });

    // array with all the subsets
    var result = [];

    while (numbers.length > 0) {
        var i;
        var sum = 0;
        var addedIndices = [];

        // go from the largest to the smallest number and
        // add as many of them as long as the sum isn't above target
        for (i = 0; i < numbers.length; i++) {
            if (sum + numbers[i] <= target) {
                sum += numbers[i];
                addedIndices.push(i);
            }
        }

        // remove the items we summed up from the numbers array, and store the items to result
        // since we're going to splice the numbers array several times we start with the largest index
        // and go to the smallest to not affect index position with splice.
        var subset = [];
        for (i = addedIndices.length - 1; i >= 0; i--) {
            subset.unshift(numbers[addedIndices[i]]);
            numbers.splice(addedIndices[i], 1);
        }
        if (numbers.length == 0) {
            //console.log("outlier's turn: " + subset);
            result.push("<"+subset+">");
        } else {
            result.push(subset);
        }
    }

    return result;
}

function getResults(jobs, time, record, jobtimes, totalJobTime, taskbreaks, totalBreakTime) {
    let maxBreaks = Math.floor(document.getElementById('maxbreaks').value);
    let minBreaks = Math.floor(document.getElementById('minbreaks').value);
    minBreaks  == "" ? minBreaks = 1 : minBreaks = minBreaks;
    maxBreaks == "" ? maxBreaks = totalJobTime : maxBreaks = maxBreaks;
    let minBreaktime = 5;
    let totalFreeTime = time - totalJobTime;
    let resultSentence = document.getElementById('resultSentence');
    for (let i = jobtimes.length-1; i >=0; i--) {
        jobtimes[i] = Math.floor(jobtimes[i]);
    }
    let idealBreaktime = 0;
    if (numJobs == 1) {
        let list = document.getElementById("list");
        list.innerHTML = "";
        resultSentence.innerHTML = "";
        resultSentence.innerHTML = "Take a " + totalBreakTime + " minute break after " + totalJobTime + " minutes.";
        $('#list').append(("1. " + jobs[0] + " (" + jobtimes[0] + "). <br>"));
        $('#list').append("TAKE A BREAK! (" + totalBreakTime + ")");
        return;
    }
    idealJobSets = getIdealJobSum(totalJobTime, jobtimes, minBreaks, maxBreaks);
    idealBreaktime = getIdealBreakTime(jobSets, totalJobTime, totalBreakTime);
    result = createSubsets(jobtimes, idealJobSets)
    //console.log('result ' + JSON.stringify(result));
    //console.log('jobsets: ' + idealJobSets);
    //console.log('numBreaks: ' + numBreaks);
    //console.log('totalBreaktime: ' + totalFreeTime);
    //console.log('idealBreaktime: ' + idealBreaktime);
    leftover = totalJobTime - (idealJobSets*(numBreaks));
    //console.log("leftovers: " + leftover);
    let nullBreakFailSafe = false;
    if (idealJobSets == 0) {
        numBreaks = 1;
        nullBreakFailSafe = true;
    }
    if (numBreaks != 1) {
        if (leftover> 0) {
            //console.log("EVENT outlier: " + leftover);
            resultSentence.innerHTML = "Take a " + Math.floor(idealBreaktime-leftover) + " minute break after " + Math.round(idealJobSets) + ". Then take a " + idealBreaktime + " minute break after every " + Math.round(idealJobSets) + " minutes...which is " + numBreaks + " breaks.";
        } else {
            resultSentence.innerHTML = "Take a " + idealBreaktime + " minute break after every " + Math.round(idealJobSets) + " minutes...which is " + numBreaks + " breaks.";
        }
    } else {
        if (leftover> 0) {
            //console.log("EVENT outlier: " + leftover);
            nullBreakFailSafe == true ? resultSentence.innerHTML = "Take a " + Math.floor(totalFreeTime) + " minute break after " + Math.round(leftover) + " minutes."
            : "Take a " + Math.floor(totalFreeTime) + " minute break after " + Math.round(idealJobSets) + " minutes. Before continuing for another " + Math.round(leftover) + " minutes."
        } else {
            resultSentence.innerHTML = "Take a " + totalFreeTime + " minute break after " + Math.round(idealJobSets) + " minutes.";
        }
    }
    let jobnames = [];
    //console.log("editing list ")
    for (let i = 0; i< jobtimes.length; i++) {
        for (let a = 0; a < record.length; a+=2) {
            //console.log(record[a], jobtimes[i], i, a);
            if (record[a] == jobtimes[i]) {
                //console.log("adding");
                jobnames.push(record[a+1]);
                record.splice(a, 2);
            }
        }
    }
    let list = document.getElementById("list");
    list.innerHTML = "";
    let sum = 0;
    timeToBreak = false;
    for (let a = jobtimes.length-1; a >= 0; a--) {
        if (timeToBreak) {
            $('#list').append("TAKE A BREAK! (" + idealBreaktime + ") <br>");   
            timeToBreak = false;  
            sum = 0;       
        }
        sum+=jobtimes[a];
        $('#list').append((jobtimes.length)-a + ". " + jobnames[a] + " (" + jobtimes[a] + "). <br>");
        if (nullBreakFailSafe) {
            //console.log('WORKING')
            if (sum == Math.round(leftover)) {
                //console.log('WORKINGGGGGGG')
                $('#list').append("TAKE A BREAK! (" + idealBreaktime + ") <br>"); 
            }
        } else {
            if (sum == idealJobSets) {
                timeToBreak = true;
            }  
        }   
    }


}

function go() {
    if (jobs, time) {
        //console.log("go pressed");
        let jobtimes = [];
        //console.log("CLEARED JOBTIMES: " + jobtimes);
        let jobs = []
        let totalJobTime = 0;
        let time = timefield.value;
        let record = [];
        let jobnames = [];
        let go = true;
        jobs = getJobs(); 
        jobtimes = getJobtimes();
        //console.log("function return: " + jobtimes);
        jobtimes.forEach((a) => {
            //isNaN(parseInt(a)) ? go = false : //console.log("not NAN");
            if (isNaN(parseInt(a)) != false || a == '') {
                //console.log("NAN " + a);
                go = false;
                jobs = [];
                jobtimes = [];
            }
            ////console.log(parseInt(a));
        });
        //console.log("GO: " + go);
        if (go) {
            jobs.forEach((a, b) => {
                if (a == "") {
                    jobs.splice(b, 1, "--"); 
                }
            });
            //console.log('jobtimes: ' + jobtimes);
            //console.log('jobs: ' + jobs);
            jobtimes.forEach(a => jobtimes.splice(jobtimes.indexOf(a), 1, parseInt(a)));
            jobtimes.forEach(function(item) {totalJobTime+=item});
            jobtimes.forEach((b, a) => {
                record.push(jobtimes[a])
                record.push(jobs[a]);
            });
            jobtimes.sort((a, b) => a - b);
            //console.log('totalJobTime ' + totalJobTime);
            //console.log(jobtimes);
            //console.log("RECORD: " + record);
            let totalBreakTime = time - totalJobTime;

            
            if (totalJobTime > time) {
                alert('Not Enough Time for all those tasks!');
            }
            else if (totalJobTime == time) {
                alert('no time for breaks!');
            }
            else if(jobs == 0, time == 0, jobtimes == 0) {
                alert ('Invalid values entered');
            }
            else {
            getResults(jobs, time, record, jobtimes, totalJobTime, taskbreaks, totalBreakTime);
            }
        } else {
            alert("Invalid or Incomplete input");
        }
        
        
    }
}
