/**
 * Created by lespingal on 22/07/15.
* pierre.lespingal@gmail.com
 */

var simu = new SIMU.Simu();
simu.setDomElement(document.getElementById('app'));
simu.setupSimu();

simu.addScript(part, partScript, true);
simu.addScript(star, starScript, true);
simu.addScript(schaaff, schaaffScript, false);


simu.setupGui();
