#include "FileStorage.h"

#ifndef FILE_STORAGE_CREDENTIALS_PATH 
#define FILE_STORAGE_CREDENTIALS_PATH  "/credentials/creds.json"
#endif 

#ifndef FILES_PATTERNS_PATH
#define FILES_PATTERNS_PATH "/patterns"
#endif


#if DEVICE_MODE_OPERATION == DEVICE_MODE_CONTROLLER

extern FeqPatterns feqPatterns;

#endif


FileStorage::FileStorage(){
    jsonDoc = new DynamicJsonDocument(12800);
    memset(&feqPatterns,0,sizeof(feqPatterns));
    credentials.pwrdLength = 0;
    credentials.ssidLength = 0;
}

void FileStorage::init(void){
    if (!SPIFFS.begin(true)){
        while(true){
            delay(2000);
            log_e("Error mounting SPIFFS.");
        }
    }
    log_i("SPI Flash File Storage initialized successfully !");
    readFileCredentials();
}

String FileStorage::readFileTxt(fs::FS &fs, const char * path){
  log_d("Reading file: %s\r\n", path);
  File file = fs.open(path);
  if(!file || file.isDirectory()){
    log_e("Failed to open text file for reading");
    return String();
  }
  String fileContent;
  while(file.available()){
    fileContent = file.readString();
    break;     
  }
  return fileContent;
}

bool FileStorage::isPatternFileNameValid(const char* name){

    const char* patternPrefix = "pattern_";
    const char* jsonSuffix = ".json";
    const uint8_t maxFileNameLenght = 16;

    return ( strstr(name, patternPrefix)       && 
             strlen(name) <= maxFileNameLenght &&
             strstr(name, jsonSuffix));

}

uint8_t FileStorage::validatePatternFile(const char* fileName){
    const uint8_t maxPatternsSupport = 16;
    if(isPatternFileNameValid(fileName)){
        uint8_t patternIndex = atoi(&fileName[8]);
        if(patternIndex <= maxPatternsSupport){
            return patternIndex;
        }
    }
    log_e("Invalid pattern file name.");
    return 0xFF;
}

CRGB FileStorage::mapColourNameToColour(const char* colorName){

    if (strcmp(colorName, "Red") == 0) return CRGB::Red;
    if (strcmp(colorName, "Green") == 0) return CRGB::Green;
    if (strcmp(colorName, "Blue") == 0) return CRGB::Blue;
    if (strcmp(colorName, "Yellow") == 0) return CRGB::Yellow;
    if (strcmp(colorName, "Purple") == 0) return CRGB::Purple;
    if (strcmp(colorName, "DarkBlue") == 0) return CRGB::DarkBlue;
    if (strcmp(colorName, "Magenta") == 0) return CRGB::Magenta;
    if (strcmp(colorName, "Tomato") == 0) return CRGB::Tomato;
    return CRGB::Black;

}

void FileStorage::populateSystemPatterns(uint8_t patternIndex, File& file){

    //StaticJsonDocument<6000> jsonDoc;
    DeserializationError error = deserializeJson(*jsonDoc, file);
    if (error) {
        log_e("Failed to read patterns JSON file error = %d",error);
        file.close();
        return;
    }
    SystemPattern* systemPattern = &feqPatterns.patterns[patternIndex];
    feqPatterns.patternsCount ++;
    JsonObject root = (*jsonDoc).as<JsonObject>();
    for (JsonObject::iterator it = root.begin(); it != root.end(); ++it) {
        const char* rootKey = it->key().c_str();
        systemPattern->nameLength = strlen(rootKey) + 1;
        memcpy(systemPattern->name,rootKey,systemPattern->nameLength);
        log_d("Iterate through: %s , length %d",rootKey,systemPattern->nameLength);
        JsonObject patternObj = it->value().as<JsonObject>();
        if(patternObj.containsKey("duration")){
            systemPattern->duration =  patternObj["duration"] | 0;
        }
        if (patternObj.containsKey("phases")) {
            JsonArray phasesArray = patternObj["phases"].as<JsonArray>();
            systemPattern->phasesCount = 0;
            for (JsonVariant phaseVar : phasesArray) {
                PatternPhase* phase = &systemPattern->phases[systemPattern->phasesCount++];
                JsonObject phaseObj = phaseVar.as<JsonObject>();
                phase->index = phaseObj["phase"] | 0;
                log_d("Extracting phase %d :",phase->index);
                JsonArray actionsArray = phaseObj["nodes"];
                phase->nodeCount = 0;
                for (JsonVariant actionVar : actionsArray) {
                    JsonObject actionObj = actionVar.as<JsonObject>();
                    NodeAction* action = &phase->actions[phase->nodeCount++];
                    const char* colour = actionObj["color"];
                    action->index = actionObj["node"] | 0;
                    action->colour = mapColourNameToColour(colour);
                    action->duration = actionObj["secs"] | 0;;
                    log_d("Node index = %d, color String: %s , HEX 0x%04X , secs = %d",
                        action->index,
                        colour,
                        action->colour,
                        action->duration);
                }
            }
            break;
        }
    }
}

void FileStorage::extractPatternsData(File& file){
    const char* fileName = file.name();
    log_d("Found Pattern JSON file: %s",fileName);
    uint8_t patternIndex = validatePatternFile(fileName);
    if(patternIndex != 0xFF){
        populateSystemPatterns(patternIndex-1,file);
    }
}

void FileStorage::readFilesPatterns(void){
    log_d("Reading Patterns Files.");
    File pattersnDir = SPIFFS.open(FILES_PATTERNS_PATH);
    if(!pattersnDir){
        log_e("Unable to open patterns directory. ");
        return;
    }
    File file = pattersnDir.openNextFile();
    while(file){
        extractPatternsData(file);
        file = pattersnDir.openNextFile();
    }
    pattersnDir.close();
}

void FileStorage::readFileCredentials(void){

    if(!SPIFFS.exists(FILE_STORAGE_CREDENTIALS_PATH)){
        log_e("Credentials file does not exist.");
        return;
    }
    File file = SPIFFS.open(FILE_STORAGE_CREDENTIALS_PATH, "r");
    if (!file) {
        log_e("Failed to open credentials file");
        return;
    }
    //StaticJsonDocument<200> jsonDoc;
    DeserializationError error = deserializeJson(*jsonDoc, file);
    if (error) {
        log_e("Failed to read JSON file");
        file.close();
        return;
    }
    const char* SSID     = (*jsonDoc)["SSID"];
    const char* Password = (*jsonDoc)["Password"]; 
    uint8_t ssidLength     = measureJson((*jsonDoc)["SSID"]);
    uint8_t passwordLength = measureJson((*jsonDoc)["Password"]);
    file.close();
    credentials.pwrdLength = passwordLength - 1;
    for(uint8_t k = 0; k < credentials.pwrdLength; k++){
        credentials.pwrd[k] = Password[k];
    }
    credentials.ssidLength = ssidLength - 1;
    for(uint8_t k = 0; k < credentials.ssidLength; k++){
        credentials.ssid[k] = SSID[k];
    }
    log_i("Cred -> p=%s, s=%s",credentials.pwrd,credentials.ssid);
}

bool FileStorage::resetCredentials(fs::FS &fs){
    File file = fs.open(FILE_STORAGE_CREDENTIALS_PATH, FILE_WRITE);

    if(!file){

        log_e("Failed to open file for writing");
        return false;

    }
    else{
        log_w("Proceeding to reset credentials in the device !");
        DynamicJsonDocument jsonDocument(1024);
        jsonDocument["SSID"] = "NS";
        jsonDocument["Password"] ="NP";
        serializeJson(jsonDocument, file);
        file.close();
        return true;
    }
}

bool FileStorage::writeCredentials(fs::FS &fs, CredentialsType* cred){

    if(cred != nullptr){

        File file = fs.open(FILE_STORAGE_CREDENTIALS_PATH, FILE_WRITE);
        if(!file){
            log_e("Failed to open file for writing");
            return false;
        }

        log_w("Proceeding to save the following credentials ");
        log_w("SSID:  %s , length = %d",cred->ssid,cred->ssidLength);
        log_w("Password: %s , length = %d",cred->pwrd,cred->pwrdLength);
        DynamicJsonDocument jsonDocument(1024);
        jsonDocument["SSID"] = cred->ssid;
        jsonDocument["Password"] = cred->pwrd;
        serializeJson(jsonDocument, file);
        file.close();
        return true;
    }
    else{
        log_e("Credentials do not exist, Failed updating SPIFFS !");
        return false;
    }

}

CredentialsType* FileStorage::getCredentials(void){    
    
    if( credentials.pwrdLength < SYSTEM_CREDENTIALS_MIN_LENGTH ||
        credentials.pwrdLength > SYSTEM_CREDENTIALS_MAX_LENGTH || 
        credentials.ssidLength < SYSTEM_CREDENTIALS_MIN_LENGTH ||
        credentials.ssidLength > SYSTEM_CREDENTIALS_MAX_LENGTH
        ){
        return nullptr;
    }
    return &credentials;
}