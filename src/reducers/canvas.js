import ActionType from '../actions/types';
import  d3DefaultSpec from '@/charts/D3/spec';
import d3Channels from '@/charts/D3/channels';

const initialState = {
    isElementSelected: false,
    isCleanInterationLayer: false,
    elementIndex: -1,
    elementName: '',
    actionHistory: [],
    dragPos:'', // for tool display
    transformInfo:'', // for tool display
    widgets: [],//for layout-grid
    selectChartIndex: -1,
    layout:'',
    backgroundColor: '#fff',
    cardColor: '#fff',
    textColor: 'rgb(64,64,64)',
    shadowColor: 'rgb(250,250,250)',
    colormap: [],
    currentColorset: ["rgb(74,137,160)", "rgb(4,37,74)", "rgb(196,218,219)", "rgb(254,193,78)", "rgb(255,214,137)", "rgb(247,150,38)", "rgb(218,107,114)", "rgb(228,214,167)", "rgb(136,119,44)", "rgb(69,67,74)"],
    globalColorpair: [],
    displayFlag: false,

    chartMode: 'bar chart',
    generateChannels: d3Channels('bar chart'),
    generateSpec: d3DefaultSpec('bar chart'),

    editMode: false,
    editChannels: '',
    editSpec: '',  
    
    colorsetType: 1,
    colorsetIndex: 0,

    isLoading: false,
}

export default (state = initialState, action) => {
    // const newState = Object.assign({},state);
    const newState = {...state};
    newState.actionHistory = state.actionHistory.slice();
    newState.actionHistory.push(action);
    switch (action.type) {
        //layout-grid action
        case ActionType.ADD_CHART:
            newState.widgets = action.widgets;
            // newState.colormap = action.colormap;
            return newState;
        case ActionType.REMOVE_CHART:
            newState.widgets = action.widgets;
            // newState.colormap = action.colormap;
            return newState;
        case ActionType.SELECT_CHART:
            newState.selectChartIndex = action.index; 
            return newState;
        case ActionType.CHANGE_LAYOUT:
            newState.layout = action.layout; 
            return newState;
        
        case ActionType.CHANGE_MAPPING:
            newState.widgets = action.widgets;
            // newState.colormap = action.colormap;
            return newState;
        
        case ActionType.CHANGE_COLORMAP:
            newState.colormap = action.colormap;
            return newState;
        
        case ActionType.CHANGE_CURRENTCOLORSET:
            newState.currentColorset = action.currentColorset;
            return newState;
        
        case ActionType.CHANGE_GLOBALCOLORAIR:
            newState.globalColorpair = action.globalColorpair;
            return newState;

        case ActionType.CHANGE_CHARTMODE:
            newState.chartMode = action.chartMode;
            console.log('change-chartmode',action.chartMode)
            return newState;
        case ActionType.CHANGE_GENERATECHANNELS:
            newState.generateChannels = action.generateChannels;
            return newState;

        case ActionType.CHANGE_GENERATESPEC:
            newState.generateSpec = action.generateSpec;
            return newState;

        case ActionType.CHANGE_EDITMODE:
            newState.editMode = action.editMode;
            return newState;
        case ActionType.CHANGE_EDITCHANNELS:
            newState.editChannels = action.editChannels;
            return newState;

        case ActionType.CHANGE_EDITSPEC:
            newState.editSpec = action.editSpec;
            return newState;

        case ActionType.CHANGE_LOADING:
            newState.isLoading = action.isLoading;
            return newState;
        
        
        case ActionType.DISPLAY_BOOKMARKS:
            newState.displayFlag = action.displayFlag;
            return newState;

        case ActionType.CHANGE_COLORSTYLE:
            newState.backgroundColor = action.color;
            newState.cardColor = action.cardcolor;
            newState.textColor = action.textcolor;
            newState.shadowColor = action.shadowcolor;
            return newState;

        case ActionType.CHANGE_COLORSET:
            newState.colorsetType = action.colorsetType;
            newState.colorsetIndex = action.colorsetIndex;
            return newState;
        

        case ActionType.SELECT_ELEMENT:
            newState.isElementSelected = true;
            newState.elementIndex = action.elementIndex;
            newState.elementName = action.elementName;
            return newState;
        case ActionType.DRAG_ELEMENT:
            newState.dragPos = action.dragPos;
            return newState;
        case ActionType.TRANSFORM_ELEMENT:
            newState.transformInfo = action.transformInfo;
            return newState;
        case ActionType.UNSELECT_ELEMENT:
            newState.isElementSelected = false;
            newState.elementIndex = -1;
            newState.elementName = '';
            return newState;
        case ActionType.CLEAN_INTERACTION_LAYER: 
            newState.isCleanInterationLayer = action.isCleanInterationLayer;
            return newState;
        case ActionType.ADD_ELEMENT:
            newState.isElementSelected = false;
            newState.elementIndex = -1;
            newState.elementName = '';
            return newState;
        case ActionType.REMOVE_ELEMENT:
            newState.isElementSelected = false;
            newState.elementIndex = -1;
            newState.elementName = '';
            return newState
        case ActionType.UPDATE_ELEMENT:
            //TODO: add action detail
            newState.isElementSelected = true;
            newState.elementIndex = action.elementIndex;
            newState.elementName = action.elementName;
            return newState
        case ActionType.REORDER_ELEMENT:
            newState.isElementSelected = true;
            newState.elementIndex = action.destinationIndex;
            return newState
        case ActionType.UNDO_CANVAS:
            //TODO: undo
            return state
        case ActionType.REDO_CANVAS:
            //TODO: redo
            return state
        default:
            return state
    }
}