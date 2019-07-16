const parseXml = require('xml2js').parseString;

const convertToObj = async data => {
  return new Promise((resolve, reject) =>
    parseXml(data, { mergeAttrs: true, explicitArray: false }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  );
};

const formatDoc = doc => {
  if (!doc) {
    return [];
  }

  return Array.isArray(doc)
    ? doc.map(({ str }) => ({ [str.name]: str._ }))
    : [{ [doc.str.name]: doc.str._ }];
};

const parseSearchResult = async data => {
  const parsed = await convertToObj(data);

  const { numFound, start, doc } = parsed.response.result;
  const result = { numFound, start, doc: formatDoc(doc) };

  return JSON.stringify(result);
};

const parseAnalysisResult = async data => {
  if (!data) {
    return data;
  }

  const parsed = await convertToObj(data);
  return JSON.stringify(parsed.analysis);
};

module.exports = { parseSearchResult, parseAnalysisResult };