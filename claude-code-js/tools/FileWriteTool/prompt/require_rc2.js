// var: require_rc2
var require_rc2 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util3();
  var piTable = [
    217,
    120,
    249,
    196,
    25,
    221,
    181,
    237,
    40,
    233,
    253,
    121,
    74,
    160,
    216,
    157,
    198,
    126,
    55,
    131,
    43,
    118,
    83,
    142,
    98,
    76,
    100,
    136,
    68,
    139,
    251,
    162,
    23,
    154,
    89,
    245,
    135,
    179,
    79,
    19,
    97,
    69,
    109,
    141,
    9,
    129,
    125,
    50,
    189,
    143,
    64,
    235,
    134,
    183,
    123,
    11,
    240,
    149,
    33,
    34,
    92,
    107,
    78,
    130,
    84,
    214,
    101,
    147,
    206,
    96,
    178,
    28,
    115,
    86,
    192,
    20,
    167,
    140,
    241,
    220,
    18,
    117,
    202,
    31,
    59,
    190,
    228,
    209,
    66,
    61,
    212,
    48,
    163,
    60,
    182,
    38,
    111,
    191,
    14,
    218,
    70,
    105,
    7,
    87,
    39,
    242,
    29,
    155,
    188,
    148,
    67,
    3,
    248,
    17,
    199,
    246,
    144,
    239,
    62,
    231,
    6,
    195,
    213,
    47,
    200,
    102,
    30,
    215,
    8,
    232,
    234,
    222,
    128,
    82,
    238,
    247,
    132,
    170,
    114,
    172,
    53,
    77,
    106,
    42,
    150,
    26,
    210,
    113,
    90,
    21,
    73,
    116,
    75,
    159,
    208,
    94,
    4,
    24,
    164,
    236,
    194,
    224,
    65,
    110,
    15,
    81,
    203,
    204,
    36,
    145,
    175,
    80,
    161,
    244,
    112,
    57,
    153,
    124,
    58,
    133,
    35,
    184,
    180,
    122,
    252,
    2,
    54,
    91,
    37,
    85,
    151,
    49,
    45,
    93,
    250,
    152,
    227,
    138,
    146,
    174,
    5,
    223,
    41,
    16,
    103,
    108,
    186,
    201,
    211,
    0,
    230,
    207,
    225,
    158,
    168,
    44,
    99,
    22,
    1,
    63,
    88,
    226,
    137,
    169,
    13,
    56,
    52,
    27,
    171,
    51,
    255,
    176,
    187,
    72,
    12,
    95,
    185,
    177,
    205,
    46,
    197,
    243,
    219,
    71,
    229,
    165,
    156,
    119,
    10,
    166,
    32,
    104,
    254,
    127,
    193,
    173
  ], s2 = [1, 2, 3, 5], rol = function(word, bits2) {
    return word << bits2 & 65535 | (word & 65535) >> 16 - bits2;
  }, ror = function(word, bits2) {
    return (word & 65535) >> bits2 | word << 16 - bits2 & 65535;
  };
  module.exports = forge.rc2 = forge.rc2 || {};
  forge.rc2.expandKey = function(key2, effKeyBits) {
    if (typeof key2 === "string")
      key2 = forge.util.createBuffer(key2);
    effKeyBits = effKeyBits || 128;
    var L2 = key2, T = key2.length(), T1 = effKeyBits, T8 = Math.ceil(T1 / 8), TM = 255 >> (T1 & 7), i5;
    for (i5 = T;i5 < 128; i5++)
      L2.putByte(piTable[L2.at(i5 - 1) + L2.at(i5 - T) & 255]);
    L2.setAt(128 - T8, piTable[L2.at(128 - T8) & TM]);
    for (i5 = 127 - T8;i5 >= 0; i5--)
      L2.setAt(i5, piTable[L2.at(i5 + 1) ^ L2.at(i5 + T8)]);
    return L2;
  };
  var createCipher = function(key2, bits2, encrypt) {
    var _finish = !1, _input = null, _output = null, _iv = null, mixRound, mashRound, i5, j4, K = [];
    key2 = forge.rc2.expandKey(key2, bits2);
    for (i5 = 0;i5 < 64; i5++)
      K.push(key2.getInt16Le());
    if (encrypt)
      mixRound = function(R2) {
        for (i5 = 0;i5 < 4; i5++)
          R2[i5] += K[j4] + (R2[(i5 + 3) % 4] & R2[(i5 + 2) % 4]) + (~R2[(i5 + 3) % 4] & R2[(i5 + 1) % 4]), R2[i5] = rol(R2[i5], s2[i5]), j4++;
      }, mashRound = function(R2) {
        for (i5 = 0;i5 < 4; i5++)
          R2[i5] += K[R2[(i5 + 3) % 4] & 63];
      };
    else
      mixRound = function(R2) {
        for (i5 = 3;i5 >= 0; i5--)
          R2[i5] = ror(R2[i5], s2[i5]), R2[i5] -= K[j4] + (R2[(i5 + 3) % 4] & R2[(i5 + 2) % 4]) + (~R2[(i5 + 3) % 4] & R2[(i5 + 1) % 4]), j4--;
      }, mashRound = function(R2) {
        for (i5 = 3;i5 >= 0; i5--)
          R2[i5] -= K[R2[(i5 + 3) % 4] & 63];
      };
    var runPlan = function(plan) {
      var R2 = [];
      for (i5 = 0;i5 < 4; i5++) {
        var val = _input.getInt16Le();
        if (_iv !== null)
          if (encrypt)
            val ^= _iv.getInt16Le();
          else
            _iv.putInt16Le(val);
        R2.push(val & 65535);
      }
      j4 = encrypt ? 0 : 63;
      for (var ptr = 0;ptr < plan.length; ptr++)
        for (var ctr = 0;ctr < plan[ptr][0]; ctr++)
          plan[ptr][1](R2);
      for (i5 = 0;i5 < 4; i5++) {
        if (_iv !== null)
          if (encrypt)
            _iv.putInt16Le(R2[i5]);
          else
            R2[i5] ^= _iv.getInt16Le();
        _output.putInt16Le(R2[i5]);
      }
    }, cipher = null;
    return cipher = {
      start: function(iv, output) {
        if (iv) {
          if (typeof iv === "string")
            iv = forge.util.createBuffer(iv);
        }
        _finish = !1, _input = forge.util.createBuffer(), _output = output || new forge.util.createBuffer, _iv = iv, cipher.output = _output;
      },
      update: function(input) {
        if (!_finish)
          _input.putBuffer(input);
        while (_input.length() >= 8)
          runPlan([
            [5, mixRound],
            [1, mashRound],
            [6, mixRound],
            [1, mashRound],
            [5, mixRound]
          ]);
      },
      finish: function(pad) {
        var rval = !0;
        if (encrypt)
          if (pad)
            rval = pad(8, _input, !encrypt);
          else {
            var padding = _input.length() === 8 ? 8 : 8 - _input.length();
            _input.fillWithByte(padding, padding);
          }
        if (rval)
          _finish = !0, cipher.update();
        if (!encrypt) {
          if (rval = _input.length() === 0, rval)
            if (pad)
              rval = pad(8, _output, !encrypt);
            else {
              var len = _output.length(), count3 = _output.at(len - 1);
              if (count3 > len)
                rval = !1;
              else
                _output.truncate(count3);
            }
        }
        return rval;
      }
    }, cipher;
  };
  forge.rc2.startEncrypting = function(key2, iv, output) {
    var cipher = forge.rc2.createEncryptionCipher(key2, 128);
    return cipher.start(iv, output), cipher;
  };
  forge.rc2.createEncryptionCipher = function(key2, bits2) {
    return createCipher(key2, bits2, !0);
  };
  forge.rc2.startDecrypting = function(key2, iv, output) {
    var cipher = forge.rc2.createDecryptionCipher(key2, 128);
    return cipher.start(iv, output), cipher;
  };
  forge.rc2.createDecryptionCipher = function(key2, bits2) {
    return createCipher(key2, bits2, !1);
  };
});
