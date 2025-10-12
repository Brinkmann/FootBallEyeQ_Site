#include "LedStrip.h"
#include "../SystemTypes.h"
#include "../DeviceModel.h"
#include "../commands/feqCmdProcessor.h"

CRGB leds[RGB_LED_STRIP_NUMBER_OF_LEDS];

/**
 * @note Assuming Led Strip task interval is 100 milliseconds. 
 * 
 */
#ifndef THREAD_TIME_MULTIPLIER_SECONDS
#define THREAD_TIME_MULTIPLIER_SECONDS 10
#endif

CRGB colorsAvailable[] = {

    CRGB::Red,    
    CRGB::Green,  
    CRGB::Blue,   
    CRGB::Yellow,  
    CRGB::Purple,
    CRGB::DarkBlue, 
    CRGB::Magenta,
    CRGB::Tomato,

};

volatile LedPatternAttributes ledPatternStrip;

volatile LedNodeUpdateAttributes ledUpdateNode;

static void displayLedStripStartUp(void){

  uint8_t colorsCount = sizeof(colorsAvailable)/sizeof(CRGB);
  for(uint8_t l = 0; l < RGB_LED_STRIP_NUMBER_OF_LEDS; l ++){
      leds[l] = colorsAvailable[0];
      FastLED.show();
      vTaskDelay(pdMS_TO_TICKS(10));
  }
  for(uint8_t l = 0; l < RGB_LED_STRIP_NUMBER_OF_LEDS; l ++){
      leds[l] = CRGB::Black;
      FastLED.show();
  }

}

static void fillStrip(const CRGB colour){

  for(uint8_t k = 0; k < RGB_LED_STRIP_NUMBER_OF_LEDS; k ++){
    leds[k] = colour;
  }
  FastLED.show();

}


const char* colorToName(const CRGB color){

  if(CRGB::Red == color) return "Red";
  if(CRGB::Green == color) return "Green";
  if(CRGB::Blue == color) return "Blue";
  if(CRGB::Yellow == color) return "Yellow";
  if(CRGB::Purple == color) return "Purple";
  if(CRGB::DarkBlue == color) return "DarkBlue";
  if(CRGB::Magenta == color) return "Magenta";
  if(CRGB::Tomato == color) return "Tomato";
  return "Unknown";

}

#if DEVICE_MODE_OPERATION == DEVICE_MODE_CONTROLLER

/**
 * @brief Device controller mode execution, 
 *        for LED strup specific tasks.
 * 
 */

#ifndef LED_STRIP_TASK_SLEEP_MS_CONTROLLER
#define LED_STRIP_TASK_SLEEP_MS_CONTROLLER 100
#endif

typedef struct NodeActionExecution{

  uint32_t durationMs;
  CRGB colour;
  uint8_t phase;
  uint8_t node; 

} NodeActionExecution;

typedef struct PatternExecution{

  uint8_t nodesInPattern;
  uint8_t phasesInPattern;
  uint32_t cycleDuration;
  uint8_t patternActive;
  bool running;
  NodeActionExecution runners[PATTERN_NODE_ACTIONS_MAX_N];

} PatternExecution;

typedef struct NodeScanningProcess{

  uint32_t timeOut;
  uint8_t nodesFound;

} NodeScanningProcess;

static PatternExecution pEx = {0};
const SystemPattern* pt;
const PatternPhase* ph;
FeqPatterns feqPatterns;
NodeScanningProcess nodeScanning; 

extern void meshNetworkSendPacket(BinaryPacket*, uint8_t);

static void displayPatternInformation(uint8_t patternIndex){

  if(patternIndex > feqPatterns.patternsCount){
    log_e("Invalid pattern index = %d",patternIndex);
    return;
  }
  const SystemPattern* const pattern = &feqPatterns.patterns[patternIndex];
  log_i("Pattern duration : %d , name = %s , phases =%d",
        pattern->duration, pattern->name,pattern->phasesCount);
  for(uint8_t k = 0; k < pattern->phasesCount; k++){
    const PatternPhase* const phase = &pattern->phases[k];
    log_i("Feautres for phase : %d -> node count -> %d , index -> %d",
          k,phase->nodeCount,phase->index);
    for(uint8_t node = 0; node < phase->nodeCount; ++node){
      const NodeAction* const action = &phase->actions[node];
      log_i("node %d , Duration = %d , Colour = 0x%04X , %s",
              action->index,action->duration,
              action->colour,colorToName(action->colour));
    }
  }

}

static void displayPatternsAvailable(void){

  vTaskDelay(pdMS_TO_TICKS(500));
  log_i("System patterns found = %d",feqPatterns.patternsCount);
  for(uint8_t k = 0; k < feqPatterns.patternsCount; k ++){
    const SystemPattern* const pattern = &feqPatterns.patterns[k];
    log_d("name: %s , duration: %d Secs , phasesCount %d",
        pattern->name,
        pattern->duration,
        pattern->phasesCount);
  }

}

static const SystemPattern* getCurrentPattern(uint8_t index){
  return &feqPatterns.patterns[index];
}

static bool checkForPatternUpdates(void){

  if(ledPatternStrip.receivedUpdate){
    ledPatternStrip.receivedUpdate = false;
    return true;
  }
  return false;

}

static void clearAllNodesOnStartUp(void){

  FeqCmd cmd;
  cmd.id = FEQ_CMD_CLEAR_STRIP;
  FeqCmdClearStrip* clearCmd = &cmd.context.clear;
  uint8_t data[255] = {0};
  BinaryPacket bin = {
    .data = data,
    .length = 0,
  };
  clearCmd->clearType = 0x00;
  clearCmd->delayToClear = 0x00;
  FeqCmdProcessor::encodeCmd(&cmd,&bin);
  meshNetworkSendPacket(&bin,FEQ_CMD_TARGET_BROADCAST);

}


static void evaluateStripState(void){

  if(checkForPatternUpdates()){
    clearAllNodesOnStartUp();
    pt = getCurrentPattern(ledPatternStrip.patternActive);
    pEx.patternActive = ledPatternStrip.patternActive;
    pEx.running = ledPatternStrip.state;
    pEx.nodesInPattern = pt->phases[0].nodeCount;
    pEx.phasesInPattern = pt->phasesCount;
    log_d("Rx to start with pattern %d , state %s ,phases %d , nodes: %d",
          pEx.patternActive,
          (pEx.running)?"ON":"OFF" ,
          pEx.phasesInPattern, 
          pEx.nodesInPattern);
    if(pEx.running){
      static const uint8_t startingPhase = 0;
      ph = &pt->phases[startingPhase];
      for(uint8_t k = 0; k < pEx.nodesInPattern; ++k){
        pEx.runners[k].colour = ph->actions[k].colour;
        pEx.runners[k].durationMs = ph->actions[k].duration * THREAD_TIME_MULTIPLIER_SECONDS;
        pEx.runners[k].node   = ph->actions[k].index - 1;
        pEx.runners[k].phase  = startingPhase+1;
        log_d("Start Node %d , %s for %d seconds",
              pEx.runners[k].node,
              colorToName(pEx.runners[k].colour),
              pEx.runners[k].durationMs/THREAD_TIME_MULTIPLIER_SECONDS);
        if(pEx.runners[k].node == 0){
          fillStrip(pEx.runners[k].colour);
        }
        else{
            FeqCmd cmd;
            cmd.id = FEQ_CMD_FILL_STRIP;
            FeqCmdFillStrip* fillCmd = &cmd.context.fill;
            uint8_t data[255] = {0};
            BinaryPacket bin = {
              .data = data,
              .length = 0,
            };
            fillCmd->colour = pEx.runners[k].colour;
            fillCmd->delayToSart = CMD_DELAY_TO_START_FILL_DEFAULT;
            fillCmd->fillType    = CMD_FILL_TYPE_DEFAULT;
            fillCmd->pattern     = CMD_PATTERN_TYPE_DEFAULT;
            FeqCmdProcessor::encodeCmd(&cmd,&bin);
            meshNetworkSendPacket(&bin,pEx.runners[k].node);
        }
      }
    }
    else{
      log_d("Clear all nodes, received commands to turn pattern off.");
      fillStrip(CRGB::Black);
      clearAllNodesOnStartUp();
    }
  }
  if(pEx.running){

    for(uint8_t node = 0; node < pEx.nodesInPattern; ++node){

      if(--pEx.runners[node].durationMs == 0){

        ph = &pt->phases[pEx.runners[node].phase++];
        pEx.runners[node].durationMs = 
            ( ph->actions[node].duration * THREAD_TIME_MULTIPLIER_SECONDS);
        pEx.runners[node].colour = ph->actions[node].colour;

        if(node == 0){
          fillStrip(pEx.runners[node].colour);
        }
        else{
            FeqCmd cmd;
            cmd.id = FEQ_CMD_FILL_STRIP;
            FeqCmdFillStrip* fillCmd = &cmd.context.fill;
            uint8_t data[255] = {0};
            BinaryPacket bin = {
              .data = data,
              .length = 0,
            };
            fillCmd->colour = pEx.runners[node].colour;
            fillCmd->delayToSart = CMD_DELAY_TO_START_FILL_DEFAULT;
            fillCmd->fillType    = CMD_FILL_TYPE_DEFAULT;
            fillCmd->pattern     = CMD_PATTERN_TYPE_DEFAULT;
            FeqCmdProcessor::encodeCmd(&cmd,&bin);
            meshNetworkSendPacket(&bin,pEx.runners[node].node);
        }
        if(pEx.runners[node].phase >= pEx.phasesInPattern){
          pEx.runners[node].phase = 0;
        }

      }

    }
  }
}

static bool isNodeScanningDue(void){

  return((nodeScanning.timeOut++ % 202) == 0);

}

static void sendNodesPingRequest(void){

  FeqCmd cmd;
  cmd.id = FEQ_CMD_PING_REQUEST;
  FeqCmdPingRequest* pingReq = &cmd.context.pingReq;
  uint8_t data[255] = {0};
  BinaryPacket bin = {
    .data = data,
    .length = 0,
  };
  pingReq->reqType = 0x00;
  FeqCmdProcessor::encodeCmd(&cmd,&bin);
  meshNetworkSendPacket(&bin,FEQ_CMD_TARGET_BROADCAST);

}

void ledStripTask(void *pvParameters){

  displayPatternsAvailable();
  displayLedStripStartUp();
  clearAllNodesOnStartUp();
  ledPatternStrip.receivedUpdate = false;
  nodeScanning.timeOut = 200;
  nodeScanning.nodesFound = 0;
  log_i("FEQ Led strip controller mode , is ready to receive commands. ");
  while(true){

    evaluateStripState();
    if(isNodeScanningDue()){
      sendNodesPingRequest();
    }
    vTaskDelay(pdMS_TO_TICKS(LED_STRIP_TASK_SLEEP_MS_CONTROLLER));

  }
}

LedStrip::LedStrip(){}

void LedStrip::init(void){

    FastLED.addLeds<WS2813, 
                    RGB_LED_STRIP_DATA_PIN_PRIMARY, 
                    GRB>(leds, RGB_LED_STRIP_NUMBER_OF_LEDS);
    FastLED.setBrightness(SYSTEM_LED_BRIGHTNESS_DEFAULT);
    xTaskCreate(ledStripTask, "ledStripTask",20000, NULL, 1, NULL);

}

#else
/**
 * @brief Device node mode execution, 
 *        for LED strup specific tasks.
 * 
 */
#ifndef LED_STRIP_TASK_SLEEP_MS_NODE
#define LED_STRIP_TASK_SLEEP_MS_NODE 50
#endif

#ifndef NODE_ONE_MINUTE_INACTIVITY
#define NODE_ONE_MINUTE_INACTIVITY ((60U*1000U)/LED_STRIP_TASK_SLEEP_MS_NODE)
#endif

uint32_t nodeInactivityTimeut = 0; 

static bool checkForNodeUpdates(void){

  if(ledUpdateNode.receivedUpdate){
    ledUpdateNode.receivedUpdate = false;
    return true;
  }
  return false;

}

static void checkForNodeInactivityTimeout(void){

  if(nodeInactivityTimeut ++ >= NODE_ONE_MINUTE_INACTIVITY){

    log_w("Device has not received a command in 1 minute, turn strip off");
    fillStrip(CRGB::Black);
    nodeInactivityTimeut = 0;
  }

}

void ledStripTask(void *pvParameters){
  displayLedStripStartUp();
  ledUpdateNode.receivedUpdate = false;
  log_i("FEQ Led strip node mode is ready to receive commands. ");
  while(true){

    if(checkForNodeUpdates()){

      switch(ledUpdateNode.cmd->id){

        case FEQ_CMD_CLEAR_STRIP:{
            const FeqCmdClearStrip* clear = &ledUpdateNode.cmd->context.clear;
            log_i("Rx fill clear led strip , delay to clear %d , type %d",
                 clear->delayToClear,clear->clearType);
            fillStrip(CRGB::Black);
        }break;
        case FEQ_CMD_RESTART_NODE:{

        }break;
        case FEQ_CMD_PING_REQUEST:{

        }break;
        case FEQ_CMD_FILL_STRIP:{
          const FeqCmdFillStrip* fill = &ledUpdateNode.cmd->context.fill;
          log_i("Rx fill colour %s , fT = 0x%02X , dS = 0x%02X , pT = 0x%02X",
               colorToName(fill->colour),fill->fillType,
                                         fill->delayToSart,
                                         fill->pattern);
          fillStrip(fill->colour);
        }break;
        case FEQ_CMD_PERFORM_PATTERN:{

        }break;
        case FEQ_CMD_PERFORM_SELF_COMPLETE:{

        }
        break;
        default:
            log_e("Node Received unkown command , ID = %d",ledUpdateNode.cmd->id);
        break;

      }
      nodeInactivityTimeut = 0;

    }

    vTaskDelay(pdMS_TO_TICKS(LED_STRIP_TASK_SLEEP_MS_NODE));
    checkForNodeInactivityTimeout();
  }
}

LedStrip::LedStrip(){}

void LedStrip::init(void){

    FastLED.addLeds<WS2813, 
                    RGB_LED_STRIP_DATA_PIN_PRIMARY, 
                    GRB>(leds, RGB_LED_STRIP_NUMBER_OF_LEDS);
    FastLED.setBrightness(SYSTEM_LED_BRIGHTNESS_DEFAULT);
    xTaskCreate(ledStripTask, "ledStripTask",20000, NULL, 1, NULL);

}

#endif
