import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faCheckSquare,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";

function Cards() {
  return (
    <div className=" col-sm-6 col-lg-4 col-xl-3 ">
      <div className="card mb-3">
        <div className="embed-responsive embed-responsive-1by1">
          <img
            className="embed-responsive-item"
            src="https://wallpapercave.com/wp/wp4587054.jpg"
            alt="thumbnail"
          />
        </div>
        <div className="card-body p-0">
          <div className="card-text px-2 py-2">
            <div className="d-flex subtexts ">
              <span className="title">ชื่อ-นามสกุล :</span>
              <span className="des-text">นาย สมชาติ รักษ์ชาติไทย</span>
            </div>
            <div className="d-flex subtexts">
              <span className="title">สินค้า/ประเภพ :</span>
              <span className="des-text">โทรศัพท์มือถือ</span>
            </div>
            <div className="d-flex subtexts">
              <span className="title">ยอดเงิน :</span>
              <span className="des-text">120,000 บาท</span>
            </div>
            <div className="d-flex subtexts">
              <span className="title">วันที่โอนเงิน :</span>
              <span className="des-text">09/กันยายน/2564</span>
            </div>

            <div className=" subtexts">
              <span className="title w-100 d-block">รายละเอียด :</span>
              <span className="des-text my-1 d-inline-block">
                หลอกให้ซื้อสินค้าประเภททองคำ เช่น แหวน สร้อยคอ
                โดยดูดคลิปไลฟ์สดจากร้านขายทองคำชื่อ ร้านขายทองคำราชาเยาวราช
                มาที่หน้าเพจของตนเอง
                เมื่อมีคนหลงเข้ามาดูและคิดว่าเป็นหน้าร้านจริงจึงตกลงซื้อขาย
              </span>
            </div>
          </div>
          <div className="hz-line"></div>
          <div className="card-text -foot d-flex align-items-center py-2 px-2 justify-content-between">
            <p className="m-0 tex-follow">
              <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
              Followers <span>10</span>
            </p>
            <button className="btn bg-primary text-white">
              <FontAwesomeIcon icon={faCheckSquare} className="mx-2" />
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cards;
