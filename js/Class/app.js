/**
 * Created by lespingal on 22/07/15.
 */

var SIMU = SIMU || {};

var simu = new SIMU.Simu();
simu.setupSimu();
simu.setupGui();

simu.addScript(name, script, true);
simu.addScript(name2, script2, false);
simu.addScript(nameBis, scriptBis, true);