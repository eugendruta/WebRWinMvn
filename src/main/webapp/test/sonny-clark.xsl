<html xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xsl:version="1.0">
  <body style="font-family:sans-serif,Arial;font-size:12pt;background-color:#EEEEEE">
    <xsl:for-each select="catalog">
      <h1>
        <xsl:value-of select="heading"/>
      </h1>
      <h2>
        <xsl:value-of select="banner"/>
      </h2>
      <hr />
      <br />
      <xsl:for-each select="cd">
        <div style="background-color:teal;color:white;padding:4px">
          <span style="font-weight:bold">
            <xsl:value-of select="title"/>
            -
          </span>
          <xsl:value-of select="year"/>
        </div>
        <div style="margin-left:20px;margin-bottom:1em;font-size:10pt">
          <p>
            Label: <xsl:value-of select="record"/>
          </p>
        </div>
      </xsl:for-each>
    </xsl:for-each>
  </body>
</html>