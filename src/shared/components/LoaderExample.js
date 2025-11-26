import React from 'react';
import useLoader from '../hooks/useLoader';

// ตัวอย่างการใช้งาน Loader ใน component
export default function LoaderExample() {
  const { showLoader, hideLoader, isLoading } = useLoader();

  const handleAsyncOperation = async () => {
    showLoader('กำลังประมวลผล...');

    try {
      // จำลองการทำงาน async
      // await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('Operation completed');
    } catch (error) {
      console.error('Operation failed:', error);
    } finally {
      hideLoader();
    }
  };

  const handleQuickOperation = () => {
    showLoader('กำลังบันทึกข้อมูล...');

    // จำลองการทำงานที่เร็ว
    hideLoader();
  };

  return (
    <div className="container mt-5">
      <h2>Loader Examples</h2>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Async Operation</h5>
              <p className="card-text">ทดสอบ loader สำหรับการทำงานที่ใช้เวลานาน</p>
              <button
                className="btn btn-primary"
                onClick={handleAsyncOperation}
                disabled={isLoading}
              >
                {isLoading ? 'กำลังประมวลผล...' : 'เริ่มการประมวลผล'}
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Operation</h5>
              <p className="card-text">ทดสอบ loader สำหรับการทำงานที่เร็ว</p>
              <button
                className="btn btn-success"
                onClick={handleQuickOperation}
                disabled={isLoading}
              >
                {isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h5>การใช้งานใน Code:</h5>
        <pre className="bg-light p-3">
          {`import useLoader from '../hooks/useLoader';

function MyComponent() {
  const { showLoader, hideLoader } = useLoader();
  
  const handleSubmit = async () => {
    showLoader('กำลังส่งข้อมูล...');
    
    try {
      await apiCall();
    } finally {
      hideLoader();
    }
  };
}`}
        </pre>
      </div>
    </div>
  );
}
