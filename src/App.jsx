import { useEffect, useCallback, useRef, Fragment, useState } from "react";
import { Card, Image, FloatButton } from "antd";
import {
  SettingOutlined,
  ReloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";

import bgImage from "./assets/background.jpg"
import "./App.css";
import DM from "./DM";
import stca20 from "./assets/stca20.svg";
import iconLaughing from "./assets/laughing.png";
import iconSad from "./assets/sad.png";

const REACTION_DELAY_TIME = 2000;

function App() {
  let [icon, setIcon] = useState(undefined);
  let [title, setTitle] = useState("Welcome to FY26 STCA OPEN DAY");
  let [subtitle, setSubtitle] = useState(
    "Please scan your Employee card to check in"
  );

  let scannedNumber = useRef("");
  let dataManager = useRef(null);

  const { Title } = Typography;

  useEffect(() => {
    dataManager.current = new DM();
  }, []);

  const resetState = useCallback(() => {
    setIcon(undefined);
    setTitle("Welcome to FY26 STCA OPEN DAY");
    setSubtitle("Please scan your Employee card to check in");
  }, []);

  const handleScan = useCallback(
    (scannedNumber) => {
      if (dataManager.current.isUserLogged(scannedNumber.current)) {
        setIcon(iconSad);
        setTitle("You have already checked in");
        setSubtitle("Please join us for the OPEN DAY");
        setTimeout(resetState, REACTION_DELAY_TIME);
      } else {
        dataManager.current.logUser(scannedNumber.current);
        setIcon(iconLaughing);
        setTitle("Enjoy your OPEN DAY!");
        setSubtitle("Go explore the fun");
        setTimeout(resetState, REACTION_DELAY_TIME);
      }

      scannedNumber.current = "";
    },
    [dataManager, resetState]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" && scannedNumber.current.length > 0) {
        handleScan(scannedNumber);
      } else if (!isNaN(event.key)) {
        scannedNumber.current = scannedNumber.current + event.key;
      }
    },
    [handleScan]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleResetClick = useCallback(() => {
    confirm("Are you sure you want to reset the name list?") &&
      dataManager.current.emptyData();
  }, []);

  const handleExportToCSV = useCallback(() => {
    if (dataManager.current.getData().size === 0) {
      alert("Sorry, the name list is empty.");
      return;
    }
    // Convert dataArray to CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    dataManager.current.getData().forEach(function (rowArray) {
      csvContent += rowArray + "\r\n";
    });

    // Create a link element, set its href attribute, and click it programmatically
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "name-list.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();

    setTimeout(() => {
      document.body.removeChild(link); // Clean up the DOM after link has been clicked
    }, 0);
  }, []);

  return (
    <Fragment>
      <img
        src={bgImage}
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          objectFit: "fill",
          zIndex: -1,
        }}
      />
      <Card
        style={{
          width: 600,
          height: 520,
          padding: 25,
          border: undefined,
          backgroundColor: "rgba(255, 255, 255,0.65)",
        }}
      >
        <Image width={300} src={stca20} preview={false} />
        <Title level={3}>{title}</Title>
        {
          <Image
            width={200}
            height={200}
            src={icon}
            preview={false}
            style={{ visibility: icon ? "visible" : "hidden" }}
          />
        }
        <Title level={5}>{subtitle}</Title>
      </Card>

      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24 }}
        icon={<SettingOutlined />}
      >
        <FloatButton icon={<ReloadOutlined />} onClick={handleResetClick} />
        <FloatButton icon={<PrinterOutlined />} onClick={handleExportToCSV} />
      </FloatButton.Group>
    </Fragment>
  );
}

export default App;
