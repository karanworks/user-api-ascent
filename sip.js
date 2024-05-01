const AmiClient = require("asterisk-ami-client");
let client = new AmiClient();

client
  .connect("asterisk", "asterisk", {
    host: "192.168.1.246",
    port: 5038,
  })
  .then((amiConnection) => {
    client
      .on("connect", () => console.log("connect"))
      .on("event", (event) => console.log("Event here ->", event))
      .on("data", (chunk) => console.log("Chunk here ->", chunk.toString()))
      .on("response", (response) => console.log("Response here ->", response))
      .on("disconnect", () => console.log("disconnect"))
      .on("reconnection", () => console.log("reconnection"))
      .on("internalError", (error) =>
        console.log("Internal error here ->", error)
      )
      .action({
        Action: "Originate",
        Channel: "User1/100",
        Context: "transport-wss",
        Exten: "101",
        Priority: 1,
      });
  })
  .catch((error) => console.log(error));
