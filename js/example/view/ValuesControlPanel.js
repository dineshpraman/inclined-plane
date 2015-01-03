
/************************************************
*		ValuesControlPanel		*
*************************************************
*
* Displays the control panel (experimental setup) 
* Contains Panels for controlling  Mass, Ramp Length, Friction, Ramp Height 
* author: Dinesh
*/

define( function( require ) {
  'use strict';

  // general modules

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Range = require( 'DOT/Range' );
  var AccordionBox = require( 'SUN/AccordionBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // specific modules

  var HeightMeterNode= require( 'EXAMPLE_SIM/example/view/HeightMeterNode' );
  var LengthMeterNode= require( 'EXAMPLE_SIM/example/view/LengthMeterNode' );
  var ControlSlider= require( 'EXAMPLE_SIM/example/view/ControlSlider' );
  var ControlMass= require( 'EXAMPLE_SIM/example/view/ControlMass' );

  /**
   * Constructor for the ValuesControlPanel.
   * @param {model} 
   * @constructor
   */
 
   var Y_SPACING=10;
   var X_SPACING=20;

  function ValuesControlPanel ( model, options ) {

    options = _.extend( {
      fill: 'rgb(230,230,230)',
      xMargin: 15,
      yMargin: 5,
      decimals: 0,
      ticks: [],
      ticksVisible: true,
      titleAlign: 'center',
      title: 'Experimental Setup',       
    }, options );


	Node.call(this);
	this.content=new Node();

	var HMeterNode=new HeightMeterNode(model.Truck, { isInteractive: true } ) ; //height panel

	var LMeterNode=new LengthMeterNode(model.Truck, { isInteractive: true } ) ; //ramp length panel

	
     var FrictionSlider= new ControlSlider(
	model.Truck.frictionProperty, 
	new Range( 0, 1, 0.5 ), 
      {
        title: 'Friction',
        ticks: [
          {
            title: 'Smooth',
            value:  0
          },

          {
            title: 'Rough',
            value: 1
          }
        ],
	decimals:2
      } );

	var controlMass=new ControlMass( 'Weight', model.Mass.weightProperty, model.Mass.massRange ); //mass panel
	
	this.content.addChild(HMeterNode);
	this.content.addChild(LMeterNode);
	this.content.addChild(FrictionSlider);
	this.content.addChild(controlMass);

	//scaling

	HMeterNode.scale(0.85);
	LMeterNode.scale(0.85);
	FrictionSlider.scale(0.65);
	controlMass.scale(0.65);

	//positioning the nodes

	FrictionSlider.top=controlMass.bottom+Y_SPACING;
	HMeterNode.left=FrictionSlider.right+X_SPACING;
	LMeterNode.centerX=HMeterNode.centerX;
	controlMass.centerX=FrictionSlider.centerX;
	HMeterNode.centerY=FrictionSlider.centerY;
	LMeterNode.centerY=controlMass.centerY;	
	
       this.accordionContent = new Node();
       this.accordionContent.addChild( this.content );

	//display content in an AccordionBox

	var accordionBox = new AccordionBox( this.accordionContent,
      {
        titleNode: new Text( options.title, { fill:'black', font: new PhetFont( { size: 15 , weight: 'bold' } ) } ),
        fill: options.fill,
        stroke: 'black',
	lineWidth:2,
        minWidth: 270,
        contentAlign: 'center',
        titleAlign: options.titleAlign,
        buttonAlign: 'left',
        scale: 0.85,
        cornerRadius: 10,
        buttonXMargin: 8,
        buttonYMargin: 8,
	showTitleWhenExpanded: false,
      } );

    this.addChild( accordionBox );
    this.mutate( options );

  }


  return inherit( Node, ValuesControlPanel );

} );

