import React, { useEffect } from 'react';
import axios from 'axios';

const WebScraper = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch HTML content from the website
        const response = await axios.get('http://localhost:3000/');
        const htmlContent = response.data;

        // Create a DOM parser
        const parser = new DOMParser();

        // Parse the HTML content
        const doc = parser.parseFromString(htmlContent, 'text/html');

        // Find the table on the webpage
        const table = doc.querySelector('table');

        // Extract data from the table
        const allRows = Array.from(table.querySelectorAll('tr'));
        const data = allRows.map(row =>
          Array.from(row.querySelectorAll('th, td')).map(cell => cell.textContent.trim())
        );

        // Log the extracted data
        console.log(data);
 
        
        // Assuming csvData is an array where the first element is an empty string and the second element is an array of headers
        const headers = data[0];
 
        // Assuming the remaining elements are arrays representing rows of data
        const rows = data.slice(1);
        
        // Convert the CSV data into an array of objects
        const dataArray = rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                if(header == "CraftTime(hh:mm:ss)")
                header = "GrowTime"; 
                
                if(header != "")
                obj[header] = row[index]; 
            });
            return obj;
        });
        
        console.log(dataArray);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return <div>Web Scraping Component</div>;
};

export default WebScraper;
