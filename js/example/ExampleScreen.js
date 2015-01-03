
/**
 * The 'Simulation' screen. Conforms to the contract specified in joist/Screen.
 *
 */

define( function( require ) {
  'use strict';

  // modules

  var SimulationModel = require( 'EXAMPLE_SIM/example/model/SimulationModel' );
  var ExampleScreenView = require( 'EXAMPLE_SIM/example/view/ExampleScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var exampleSimString = require( 'string!EXAMPLE_SIM/example-sim.name' );

  /**
   * Creates the model and view for the ExampleScreen
   * @constructor
   */

  function ExampleScreen() {

    Screen.call( this, exampleSimString, null , //no icon, single screen sim
      function() { return new SimulationModel(); },
      function( model ) { return new ExampleScreenView( model );} 
    );

  }

  return inherit( Screen, ExampleScreen );

} );



