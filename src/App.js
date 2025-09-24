{showLogoPopup && (
          <div className="r1-popup-overlay" onClick={() => setShowLogoPopup(false)}>
            <div className="r1-popup" onClick={(e) => e.stopPropagation()}>
              about r1 tv
              r1 tv is a free IPTV streaming portal for publicly available channels from various countries.
              implemented by atomlabor.de with love for the rabbit r1 community.
              support the project:

              <div className="r1-popup-btn-row">
                <button className="r1-popup-btn" onClick={() => window.open('https://ko-fi.com/atomlabor', '_blank')}>☕ Ko-fi</button>
                <button className="r1-popup-btn" onClick={() => setShowLogoPopup(false)}>close</button>
              </div>

              <img alt="ko-fi qr code" className="r1-popup-qr" height="80" width="80"/>
            </div>
          </div>
        )}
