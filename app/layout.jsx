import "@styles/globals.css";
import Nav from "@components/Nav";
import Provider from "@components/Provider";

export const metadata = {
  title: "TagHUB",
  description: "Discover & Share AI Prompts",
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <head>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <link rel="shortcut icon" href="/assets/images/logo.svg" type="image/x-icon" />
    </head>  
    <body>
      <Provider>
        <div className="main">
          <div className="gradient" />
        </div>

        <main className="app">
          {children.props ? (
            (children.props.childProp.segment != "sign-in" && children.props.childProp.segment != "sign-up" ) ? (
              <>
                <Nav />
                {children}
              </>
            ) : (
              <>{children}</>
            )
          ) : (
            console.log("no childProp")
          )}
        </main>
      </Provider>
    </body>
  </html>
);

export default RootLayout;
