// Functie om seriële gegevens te lezen van de Arduino
async function readSerialData() {
    // Open de seriële poort
    const process = Deno.run({
      cmd: ['screen', '-L', '/dev/ttyACM0', '9600'], // Poort en baud rate
      stdout: 'piped',
      stderr: 'piped',
    });
  
    // Continu de uitvoer lezen en loggen
    while (true) {
      const output = await process.output();
      const decoder = new TextDecoder();
      const outputString = decoder.decode(output);
  
      // Log de ontvangen data
      console.log("Received data:", outputString);
  
      // Veronderstel dat de temperatuur in de gegevens zit
      const temperature = parseTemperature(outputString);
      
      if (temperature !== null) {
        console.log(`Logged Temperature: ${temperature}°C`);
      } else {
        console.log("No valid temperature data found.");
      }
  
      // Voeg een kleine vertraging toe om overbelasting van de seriële poort te voorkomen
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 seconde wachten
    }
  
    // Sluit het proces (dit wordt nooit bereikt, aangezien de loop oneindig is)
    process.close();
  }
  
  // Functie om de temperatuur uit de ontvangen string te extraheren
  function parseTemperature(data: string): number | null {
    // Voorbeeld: als de gegevens een string zijn zoals "Temp: 25.3"
    const match = data.match(/Temp:\s*(-?\d+(\.\d+)?)/); // Zoek naar "Temp: " gevolgd door een nummer
    if (match) {
      return parseFloat(match[1]); // Retourneer de temperatuur als een getal
    }
    return null; // Als er geen geldige temperatuur gevonden wordt
  }
  
  // Start het lezen van de seriële gegevens
  readSerialData();
  