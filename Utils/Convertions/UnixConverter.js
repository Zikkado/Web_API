const timeConverter = function a(date){
    var data = new Date(date * 1000);

    let dataFormatada = ((data.getDate() )) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear(); 
    return dataFormatada;
  }
  
  module .exports = timeConverter;


  