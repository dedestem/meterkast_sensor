const homeAssistantUrl = "http://<home_assistant_url>:8123"; // Vervang door je Home Assistant URL
const accessToken = "<your_access_token>"; // Vervang door je access token
const temperatureSensorEntityId = "sensor.meterkast_temperatuur"; // Vervang door je sensor's entity_id in Home Assistant

// Functie om de temperatuur naar Home Assistant te sturen
async function sendTemperatureToHomeAssistant(temperature: string) {
    try {
        const response = await fetch(
            `${homeAssistantUrl}/api/states/${temperatureSensorEntityId}`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    state: temperature, // De temperatuur als string
                    attributes: {
                        unit_of_measurement: "°C", // Of °F afhankelijk van jouw meting
                        friendly_name: "Meterkast Temperatuur",
                    },
                }),
            },
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        console.log("Temperatuur succesvol geüpdatet!");
    } catch (error) {
        console.error("Fout bij het bijwerken van de temperatuur:", error);
    }
}

// Functie om de seriële data van de Arduino in te lezen met 'screen' (Linux/macOS)
async function readSerialData() {
    const process = Deno.run({
        cmd: ["screen", "-L", "/dev/ttyACM0", "9600"], // Zorg ervoor dat je de juiste poort en baudrate gebruikt
        stdout: "piped",
        stderr: "piped",
    });

    // Wacht tot het proces voltooid is en verkrijg de output
    const output = await process.output();
    const decoder = new TextDecoder();
    const temperature = decoder.decode(output).trim(); // Veronderstel dat de Arduino temperatuur als string stuurt
    console.log("Ontvangen temperatuur:", temperature);

    // Verstuur de temperatuur naar Home Assistant
    await sendTemperatureToHomeAssistant(temperature);

    process.close();
}

// Start het lezen van de seriële poort
readSerialData().catch(console.error);
