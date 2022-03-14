var removeCartItemButtons = document.getElementsByClassName('btn-danges');
for(var i =0; i<removeCartItemButtons.length;i++){
    var button = removeCartItemButtons[i];
    button.addEventListener('click', (e)=> {
        e.target.parentElement.parentElement.remove();
        updateCartTotal();
    });
}

function updateCartTotal() {
}