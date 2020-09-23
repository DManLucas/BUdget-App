//budget controler
var budgetController = (function(){
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function (){
        return this.percentage;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
        
    };

    return{
        addItem: function(type, des, val){
            var newItem, ID;
            //ID should be last ID + 1
            //Create new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }

            //Create new item based of inc or dec type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            //Push data into our data structure
            data.allItems[type].push(newItem);
            //return the new element
            return newItem;
        },

        deleteItem: function(type, id){
            var ids, index;
            data.allItems[type][id];
            ids = data.allItems[type].map(function (current){
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function(){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            //calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            //calcualte the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
        },

        calculatePercentages : function (){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function(){
            return{
                budget: data.budget,
                totaltInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
    }

})();
//UI controler
var UIController = (function(){
    var DOMStrings ={
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputButton: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercentageLabel: ".item__percentage",
        dateLabel: ".budget__title--month"
    };

    var formatNumber = function(num, type){
        var numSplit,int, dec;
        num = Math.abs(num);
        num = num.toFixed(2); 

        numSplit = num.split('.');

        int = numSplit[0];
        if(int.length > 3){
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3); //input 2310, output 2,310
        }

        dec = numSplit[1];

        
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var NodeListForEach = function(list, callback){
        for(var i = 0; i < list.length; i++){
            callback(list[i], i);
        }
    };

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, //income or expense
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
            };
            
        },

        addListItem: function(obj, type){
           //placeholder text
            var html, newHtml, element;
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type === 'exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

           //replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
           //insert into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID){
            var el;
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function(){
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArray[0].focus();
        },

        displayBudget: function(obj){
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totaltInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = "--";
            }
        },
        
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);

            
            NodeListForEach(fields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else {
                    current.textContent = "--";
                }
            });
        },

        displayMonth: function(){
            var now, year, month, months;
            now = new Date();
            months = ['January', 'February', 'March', 
            'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function(){
            var fields;
            fields = document.querySelectorAll(
                DOMStrings.inputType +',' +
                DOMStrings.inputDescription +',' +
                DOMStrings.inputValue
                );

                NodeListForEach(fields, function (cur){
                    cur.classList.toggle('red-focus');
                });
        },

        getDOMStrings: function(){
            return DOMStrings;
        }
    };
})();

//Global  controler
var controller = (function(budgetCtrl,UICtrl){
    var setUpEventListeners = function(){
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem);
        document.addEventListener("keypress", function(e){
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function(){
        //1.calculate budget
        budgetCtrl.calculateBudget();
        //2. return the budget
        var budget = budgetCtrl.getBudget();
        //3.display the budget
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function(){
        var percentages;
        //calc percentages
        budgetCtrl.calculatePercentages();
        //read percentages from budget controller
        percentages = budgetCtrl.getPercentages();
        //update the UI
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function(){
        //1. get input data
        var input, newItem;
        input = UIController.getInput();
        if(input.description !=="" && !isNaN(input.value) && input.value > 0){
            
        //2. Add to budget controller
        newItem = budgetController.addItem(input.type, input.description, input.value);
        //3. add to UI controller
        UICtrl.addListItem(newItem, input.type);
        //4. clear fields
        UICtrl.clearFields();
        //5. calculate update/budget
        updateBudget();  
        //6. percentage
        updatePercentages();
         
        }
    };

    var ctrlDeleteItem = function(e){
        var itemID, splitID, type, ID;
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            budgetCtrl.deleteItem(type, ID);

            UICtrl.deleteListItem(itemID);

            updateBudget(); 

            updatePercentages();
        }
    };

    return {
        init: function(){
            console.log( "Application start");
            UICtrl.displayMonth ();
            UICtrl.displayBudget({
                budget: 0,
                totaltInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setUpEventListeners();
            
        }
    }
})(budgetController, UIController);

controller.init(); 