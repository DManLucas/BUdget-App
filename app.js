//budget controler
var budgetController = (function(){

})();
//UI controler
var UIController = (function(){

})();

//Global  controler
var controller = (function(budgetCtrl,UICtrl){

    var ctrlAddItem = function(){
        //1. get input data

        //2. Add to budget controller

        //3. add to UI controller

        //4. calculate budget

        //display budget
    }
    document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(e){
        if(e.keyCode === 13 || e.which === 13){
            ctrlAddItem();
        }
    });
})(budgetController, UIController);

