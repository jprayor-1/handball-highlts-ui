interface Props {
    videoProgress: number;
    isLoading: boolean;

}

export default function LoadingModal ({videoProgress, isLoading}: Props) {
    return (
        <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
        >
        <div
          style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "8px",
            textAlign: "center",
            minWidth: "300px",
          }}
        >
          {videoProgress != 100 && (
            <>
              <p>Uploading Video...</p>
              <p>{videoProgress}%</p>
              <div
                style={{
                  height: "10px",
                  background: "#eee",
                  borderRadius: "5px",
                  overflow: "hidden",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    width: `${videoProgress}%`,
                    height: "100%",
                    background: "#4caf50",
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
            </>
          )}
        
          {isLoading && videoProgress == 100 && (
          <div
            style= {{
                color: "black",
            }}
          >
            <h2>Generating Handball Clip</h2>
            <p>This may take a few minutes depending on the size of the video</p>
          </div>)}
        </div>
        </div>
    )
}

