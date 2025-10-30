import React, { useEffect, useState } from "react";

import ReactBSAlert from "react-bootstrap-sweetalert";
import { Alert, Button, CardBody } from "reactstrap";
import { Link } from "react-router-dom";

import Moment from 'moment';

function Index({ data, columns , detail, deleteData, downloadFile}) {

  const[columnTable, setColumnTable] = useState([]);
  const[viewTable, setViewTable] = useState(false);

  const[state, setState] = useState({});
  const[idDelete, setIdDelete] = useState();

  const NoDataIndication = () => (
    <Alert color="secondary" className="mt-2 mb-1 text-center">
      No results found.
    </Alert>
  );

  

  const date = (cell, row, rowIndex, formatExtraData) => {
    return (
        <>
          { Moment(cell).format('MM/DD/YYYY') }
        </>
    );
  };

  const dateHour = (cell, row, rowIndex, formatExtraData) => {
    return (
        <>
          { Moment(cell).format('MM/DD/YYYY h:mm a') }
        </>
    );
  };

  const priceCAD = (cell, row, rowIndex, formatExtraData) => {
    return (
        <>
        CAD {cell}
        </>
        
    );
  };

  const object = {
    dataField: "action",
    text: "ACTION",
    formatter: "linkFollow",
    sort: false
  }

  const hideAlert = () => {
    setState({
      alert: null
    });
  };

  const confirmAlert = (id) => {
    setState({
      alert: (
        <ReactBSAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onCancel={() => hideAlert()}
          onConfirm={() => {setIdDelete(id); hideAlert();}}
          showCancel
          confirmBtnBsStyle="hensall"
          confirmBtnText="Yes, delete it!"
          cancelBtnBsStyle="hensall-cancel"
          cancelBtnText="Cancel"
          btnSize=""
        >
          You won't be able to revert this!
        </ReactBSAlert>
      )
    });
  };

  useEffect(() => {
    loadData();
  },[]);

  useEffect(() => {
    if(idDelete){
      deleteData(idDelete);
    }
  },[idDelete]);

  const handleDelete = (e, id) => {
    e.preventDefault();
    confirmAlert(id);
  }

  const loadData = () => {
    columns.map(item => {
      if(item.formatter && item.formatter === 'dateHour'){
        item.formatter = dateHour;
      }
      if(item.formatter && item.formatter === 'date'){
        item.formatter = date;
      }
      if(item.formatter && item.formatter === 'priceCAD'){
        item.formatter = priceCAD;
      }
    });
    columns.push(object);
    setColumnTable(columns);
    setViewTable(true);
  }

  const handleDownload = (e, id, file_path) => {
    e.preventDefault();
    downloadFile(id, file_path);
  }
  
  return (
    <>
      {state.alert}
      {viewTable && data.length > 0 ? ( 
        <>
        
        </> 
      ) : (
        <CardBody>
          <Alert color="secondary" className="m-2">
            There is no information to display in this section.
          </Alert>
        </CardBody>
      )}
    </>
  );
}

export default Index;