const Serverless_Events = require('./sampleEvents.json')
const data = require('./animals.json')
const firetail = require("../dist");

//=====================================================
//====================================== test GET calls
//=====================================================

describe('test Firetail:Serverless', () => {

    test('should work with lambda function url', (done) => {

      const myFiretailOpts = {dev:true,lambda:true, addApi:"./petstore.yaml"}
      const firetailWrapper = firetailSetup(myFiretailOpts)

      const next = firetailWrapper((event) => {
        const statusCode = 200
        if(event.queryStringParameters
        && event.queryStringParameters.limit){
          return {
            statusCode,
            body: JSON.stringify(data.slice(0, event.queryStringParameters.limit)),
          };
        }
        return {
          statusCode,
          body: JSON.stringify(data),
        };
      });

      const cLog = console.log

      console.log = (txt)=>{
        expect(txt.startsWith("firetail:log-ext:")).toBe(true);
      }
      next(Serverless_Events["lambda function url"])
      .then((a)=>{
        const  {statusCode,body} = a
        expect(statusCode).toBe(200);
        expect(body).toBe('[{"id":1,"name":"Bubbles","tag":"fish"},'+
                           '{"id":2,"name":"Jax","tag":"cat"},'+
                           '{"id":3,"name":"Tiger Lily","tag":"cat"},'+
                           '{"id":4,"name":"Buzz","tag":"dog"},'+
                           '{"id":5,"name":"Duke"}]')
        return next(Serverless_Events["api Gateway Proxy Event"])
      }).then(({statusCode,body})=>{
          expect(statusCode).toBe(200);
          expect(body).toBe('[{"id":1,"name":"Bubbles","tag":"fish"},'+
                             '{"id":2,"name":"Jax","tag":"cat"}]')
        console.log = cLog.bind(console)
        done()
      })

    })

    test('should support multiple security schemes', (done) => {

      const myFiretailOpts = {
        dev:true,
        lambda:true,
        addApi:"./petstore.yaml",
        authCallbacks:{
          key:({authorization})=>{
            if("key" !== authorization){
              throw new Error("Invalid token")
            }
            return true
          }, // END key
          oauth2:({authorization,scopes},headers)=>{
            if("RsT5OjbzRn430zqMLgV3Ia" !== authorization){
              throw new Error("Invalid token")
            }
            const result = {
              scopes:Object.keys(scopes)
            }

            result.scopes.forEach(scope=>{
              result[scope] = scope
            })

            return result
          }, // END oauth2
        }, // END authCallbacks
      } // END myFiretailOpts
      const authCallbacks_key    = jest.spyOn(myFiretailOpts.authCallbacks,"key")
      const authCallbacks_oauth2 = jest.spyOn(myFiretailOpts.authCallbacks,"oauth2")

      const firetailWrapper = firetailSetup(myFiretailOpts)
      const myData = JSON.parse(JSON.stringify(data))
      const next = firetailWrapper((event) => {
        const petId = event.pathParameters.petId
        let statusCode = 202

        if(! myData.map(({id})=>id)
                   .includes(petId)){
            return {
              statusCode:400,
              body: JSON.stringify({
                type:event.rawPath,
                title:`No pet with an ID of "${petId}" was found`,
                status:400
              })
            };
        }

        const copy = [...myData]
        let removedItem = null

        //empty
        copy.forEach(()=>{
          myData.pop()
        }) // END forEach ~ empty

        //rebuild
        copy.forEach(item=>{
          if(item.id !== +petId){
            myData.push(item)
          } else {
            removedItem = item
          }
        }) // END forEach ~ rebuild

        return {
          statusCode,
          body: JSON.stringify(removedItem),
        };
    }); // END firetailWrapper

      const cLog = console.log

      console.log = (txt)=>{
        expect(txt).toMatch(/^firetail:log-ext:/);
      }
      next(Serverless_Events["api Gateway Proxy V2"])
      .then((result)=>{
        expect(result).toStrictEqual({ statusCode: 202, body: '{"id":2,"name":"Jax","tag":"cat"}' })
        expect(authCallbacks_key   ).toHaveBeenCalled();
        expect(authCallbacks_oauth2).toHaveBeenCalled();
        console.log = cLog.bind(console)
        done()
      })

    })
})
