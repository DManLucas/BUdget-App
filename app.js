//budget controler
var budgetController = (function(){
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        }
        
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
        }
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
    }
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, //income or expense
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value,
            };
            
        },

        addListItem: function(obj, type){
           //placeholder text
            var html, newHtml, element;
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type === 'exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

           //replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
           //insert into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
    };


    var ctrlAddItem = function(){
        //1. get input data
        var input, newItem;
        input = UIController.getInput();
        //2. Add to budget controller
        newItem = budgetController.addItem(input.type, input.description, input.value);
        //3. add to UI controller
        UICtrl.addListItem(newItem, input.type);
        //4. calculate budget

        //display budget
    };

    return {
        init: function(){
            console.log( "Application start");
            setUpEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();

