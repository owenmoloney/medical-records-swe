import React from "react";

export default function ViewRecords(){

    return (
        <div
           style={{
             maxWidth: 520,
             margin: "0 auto",
             fontFamily:
             "SF Pro Display, -apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif",
             textAlign: "left"
         }}
         >
           <h2
             style={{
               textAlign: "center",
               marginBottom: "1rem",
               letterSpacing: "0.16em",
               textTransform: "uppercase",
               fontSize: "0.9rem",
               color: "#6b7280"
             }}
           >
             View Records
           </h2>
     
           <p
             style={{
               textAlign: "center",
               marginBottom: "1.8rem",
               fontSize: "0.9rem",
               color: "#4b5563"
             }}
           >
              Review previous medical records below.
           </p>
         </div>
       );
   
   }