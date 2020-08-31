//budget controler
var budgetController = (function(){

})();
//UI controler
var UIController = (function(){
    var DOMStrings ={
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputButton: ".add__btn",
    }
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, //income or expense
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value,
            };
            
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
        var input = UIController.getInput();
        //2. Add to budget controller

        //3. add to UI controller

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

