// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const _ = require('lodash');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'meow meow meow, meow meow meow, meow meow meow meow meow meow meow meow meow meow meow';
        const respBuilder = handlerInput.responseBuilder;

        if (_.has(handlerInput.requestEnvelope, 'context.System.device.supportedInterfaces["Alexa.Presentation.APL"]')) {
            // add APL directives if APL interface detected
            respBuilder.speak("Hi, I'm the singing kitty.")
                .addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    token: 'singingkitty',
                    version: '1.0',
                    document: require('./documents/launchrequest.json'),
                    datasources: {
                        singingKittyData: {
                            type: "object",
                            properties: {
                                ssml: "<speak>meow meow meow, meow meow meow, meow meow meow,"+
                                        "<audio src=\"soundbank://soundlibrary/animals/amzn_sfx_cat_meow_1x_01\"/>"+
                                        "</speak>"
                            },
                            transformers: [{
                                "inputPath": "ssml",
                                "outputName": "speech",
                                "transformer": "ssmlToSpeech"
                            }]
                        }
                    }
                })
                .addDirective({
                    type: 'Alexa.Presentation.APL.ExecuteCommands',
                    token: 'singingkitty',
                    commands: [{
                        type: 'Parallel',
                        commands: [{
                            type: 'SpeakItem',
                            componentId: 'kitty'
                        },{
                            type: 'Sequential',
                            repeatCount: 3,
                            commands: [{
                                type: 'SetPage',
                                delay: 275,
                                componentId: 'kitty',
                                value: 1
                            },{
                                type: 'SetPage',
                                delay: 275,
                                componentId: 'kitty',
                                value: 2
                            },{
                                type: 'SetPage',
                                delay: 275,
                                componentId: 'kitty',
                                value: 3
                            },{
                                type: 'SetPage',
                                delay: 275,
                                componentId: 'kitty',
                                value: 0
                            }]
                        }]
                    }]
                });
        } else {
            // since it's not an APL capable device let's send a different message
            respBuilder.speak("Hi, I'm the singing kitty. You should really try me again on an Echo device with a screen.")
        }
        return respBuilder.getResponse();
    }
};
const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speechText = 'Hello World!';
        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
