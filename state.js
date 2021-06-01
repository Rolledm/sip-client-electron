const etState = {
  LOGIN: 0,
  MAIN: 1,
  CALL: 2
};
  
let applyStateChange = (state) => {
  switch (state) {
    case etState.LOGIN:
      document.getElementById("regparams").style.display = 'block';
      document.getElementById("register").style.display = 'inline';
      document.getElementById("unregister").style.display = 'none';
      document.getElementById("client").style.display = 'none';
      break;
    
    case etState.MAIN:
      document.getElementById("regparams").style.display = 'none';
      document.getElementById("register").style.display = 'none';
      document.getElementById("unregister").style.display = 'inline';
      document.getElementById("client").style.display = 'block';
      break;
  
    default:
      break;
  }
}

module.exports = {etState, applyStateChange};