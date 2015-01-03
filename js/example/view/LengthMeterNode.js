/************************************************
*		LengthMeterNode			*
*************************************************
/**
 * Displays the Panel for controlling the Ramp Length 
 * 
 * @author Dinesh
 * Based on pH scale/PHMeterNode.js (many modifications though)
 */

define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/buttons/ArrowButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  var HString = 'Ramp Length';
  var pattern_0value_1units = require( 'string!EXAMPLE_SIM/pattern_0value_1units' );


  // constants
  var X_MARGIN = 14;
  var Y_MARGIN = 10;
  var CORNER_RADIUS = 6;
  var SPINNER_DELTA = 0.01;
  var SPINNER_X_SPACING = 6;
  var SPINNER_Y_SPACING = 4;
  var SPINNER_INTERVAL_DELAY = 40;
  var SPINNER_ARROW_COLOR = 'rgb(0,200,0)';
  var DECIMAL_PLACES=2;
  var DIGITS=3;

  /**
   * Value is displayed inside of this, which sits above the scale.
   *
   * @param {boolean} isInteractive
   * @constructor
   */
  function ValueNode( Truck, isInteractive ) {

    var thisNode = this;
    Node.call( thisNode );
 

    var H=Truck.totalHeight;
    var L=Truck.totalLength;
    var scale= Truck.scale;
    var rLmin = Truck.rLmin*scale;
    var Lmax = Truck.rLmax*scale; 
    var maxH = Truck.maxH*scale;
    var minH = Truck.minH*scale;
    var Lmin = Math.max(H,rLmin);

    Truck.maxLength=Lmax;

    var Length=new Property(Lmax/scale);

    var L_RANGE= new Range( (Math.sqrt(H*H+Lmin*Lmin)/scale).toFixed(DECIMAL_PLACES), (Math.sqrt(H*H+Lmax*Lmax)/scale).toFixed(DECIMAL_PLACES) );  //range of Length values based on rlMax, rlMin, minH, maxH

    // Length value
    var valueText = new Text( Util.toFixed( Math.pow(10,DIGITS) , DECIMAL_PLACES),  //the maximum width of the box is = size (DIGITS + DECIMAL_places)
      { fill: 'black', font: new PhetFont( 20 ) } );

    // rectangle that the value is displayed in
    var valueXMargin = 8;
    var valueYMargin = 5;
    var valueRectangle = new Rectangle( 0, 0, valueText.width + ( 2 * valueXMargin ), valueText.height + ( 2 * valueYMargin ), CORNER_RADIUS, CORNER_RADIUS,
      { fill: 'white', stroke: 'darkGray' } );

    // layout
    valueText.right = valueRectangle.right - valueXMargin;
    valueText.centerY = valueRectangle.centerY;

    // parent for all components related to the value
    var valueNode = new Node( { children: [ valueRectangle, valueText ] } );

   Length.link( function( Length ) {

	valueText.text = StringUtils.format( pattern_0value_1units, Length.toFixed(DECIMAL_PLACES), 'm' );
        valueText.right = valueRectangle.right - valueXMargin; // right justified

	} );


    Truck.totalLengthProperty.link( function() { //update Length.value

	if( Length.value !== Truck.totalLength/scale )
	{
		Length.value =Truck.totalLength/scale;
	}

	} );

    // optional spinner arrows
    if ( isInteractive ) {

      var upArrowNode, downArrowNode;

      // options common to both arrow buttons
      var arrowButtonOptions = { intervalDelay: SPINNER_INTERVAL_DELAY,  arrowFill: SPINNER_ARROW_COLOR};

      // up arrow
      upArrowNode = new ArrowButton( 'up',
        function() {
          Length.value= Math.min( L_RANGE.max, Length.value + SPINNER_DELTA ) ;
          L=scale*Length.value;
          H=Truck.totalHeight;
          if ( Math.abs(Truck.rampLength/scale - Math.sqrt(L*L-H*H)/scale) >= 0.01 ) {
          Truck.rampLength=(Math.sqrt(L*L-H*H)).toFixed(0); //
	   }
		
        },
        _.extend( {
          scale:0.75,
          left: valueRectangle.right + SPINNER_X_SPACING,
          bottom: valueRectangle.centerY - ( SPINNER_Y_SPACING / 2 )
        }, arrowButtonOptions )
      );
      valueNode.addChild( upArrowNode );


      // down arrow
      downArrowNode = new ArrowButton( 'down',
        function() {
          Length.value=Math.max( L_RANGE.min,  Length.value - SPINNER_DELTA ) ;
          L=scale*Length.value;
          H=Truck.totalHeight;
          if ( Math.abs(Truck.rampLength/scale - Math.sqrt(L*L-H*H)/scale) >=0.01 ) {
          Truck.rampLength=(Math.sqrt(L*L-H*H)).toFixed(0); }
		
        },
        _.extend( {
          scale:0.75,
          left: upArrowNode.left,
          top: upArrowNode.bottom + SPINNER_Y_SPACING
        }, arrowButtonOptions )
      );
      valueNode.addChild( downArrowNode );

      // touch areas, expanded mostly to the right

      var expandX = upArrowNode.width / 2;
      var expandY = 6;
      upArrowNode.touchArea = upArrowNode.localBounds.dilatedXY( expandX, expandY ).shifted( expandX, -expandY );
      downArrowNode.touchArea = downArrowNode.localBounds.dilatedXY( expandX, expandY ).shifted( expandX, expandY );


      Truck.rampHeightProperty.link( function() {
	H=Truck.totalHeight;
	Lmin=Math.max(H,rLmin);
	L_RANGE= new Range( (Math.sqrt(H*H+Lmin*Lmin)/scale).toFixed(DECIMAL_PLACES), (Math.sqrt(H*H+Lmax*Lmax)/scale).toFixed(DECIMAL_PLACES) ); //change length range to limit min rampLength for given height
	Truck.minLength=Lmin;
	
	} );

	Length.link( function( ) {
        upArrowNode.enabled = ( Length.value < L_RANGE.max );
        downArrowNode.enabled = ( Length.value > L_RANGE.min );
      } );
    }

    // label above the value

    // label above the value
   var labelNode = new Text( HString, { fill: 'black', font: new PhetFont( { size: 13 , weight: 'bold' } ) } );

    thisNode.addChild( labelNode );
    thisNode.addChild( valueNode );

    // layout
     labelNode.top = labelNode.height +Y_MARGIN;
    labelNode.left = X_MARGIN;
    valueNode.centerX = (labelNode.width +2*X_MARGIN)/2 ; //center point
    valueNode.top = labelNode.bottom + Y_MARGIN;
  }

  inherit( Node, ValueNode );

 
 /**
   * @param {Object} [options]
   * @constructor
   */
  function LengthMeterNode( Truck, options ) {

    options = _.extend( {
      isInteractive: false, // true: pH can be changed, false: pH is read-only
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var valueNode = new ValueNode(Truck, options.isInteractive );

    // rendering order
    thisNode.addChild( valueNode );
    thisNode.mutate( options );
  }

  return inherit( Node, LengthMeterNode );
} );
